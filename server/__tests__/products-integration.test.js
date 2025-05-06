import dbUtils from '../db/utils.js';
import db from '../db/config.js';

// This is an integration test that uses the actual database
describe('Products Database Integration', () => {
  // Test product data
  const testProduct = {
    name: 'Test Product',
    description: 'Created during integration test',
    price: 99.99,
    image_url: 'https://via.placeholder.com/300',
    stock: 10
  };
  
  let createdProductId;
  
  // Clean up after all tests
  afterAll(async () => {
    // Delete the test product if it was created
    if (createdProductId) {
      await new Promise((resolve, reject) => {
        db.run('DELETE FROM products WHERE id = ?', [createdProductId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  });

  it('should create a new product in the database', async () => {
    // Insert a test product
    const result = await dbUtils.run(
      'INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)',
      [testProduct.name, testProduct.description, testProduct.price, testProduct.image_url, testProduct.stock]
    );
    
    // Save the ID for later cleanup
    createdProductId = result.id;
    
    // Verify the product was created
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
  });

  it('should retrieve the created product by ID', async () => {
    // Skip if product wasn't created
    if (!createdProductId) {
      return;
    }
    
    // Get the product by ID
    const product = await dbUtils.getById('products', createdProductId);
    
    // Verify the product data
    expect(product).toBeDefined();
    expect(product.id).toBe(createdProductId);
    expect(product.name).toBe(testProduct.name);
    expect(product.description).toBe(testProduct.description);
    expect(product.price).toBe(testProduct.price);
    expect(product.stock).toBe(testProduct.stock);
  });

  it('should retrieve all products including our test product', async () => {
    // Skip if product wasn't created
    if (!createdProductId) {
      return;
    }
    
    // Get all products
    const products = await dbUtils.getAll('products');
    
    // Verify products were returned
    expect(Array.isArray(products)).toBe(true);
    
    // Find our test product in the results
    const foundProduct = products.find(p => p.id === createdProductId);
    expect(foundProduct).toBeDefined();
    expect(foundProduct.name).toBe(testProduct.name);
  });

  it('should update the test product', async () => {
    // Skip if product wasn't created
    if (!createdProductId) {
      return;
    }
    
    // Update the product
    const updatedName = 'Updated Test Product';
    await dbUtils.run(
      'UPDATE products SET name = ? WHERE id = ?',
      [updatedName, createdProductId]
    );
    
    // Verify the update
    const product = await dbUtils.getById('products', createdProductId);
    expect(product.name).toBe(updatedName);
  });
});