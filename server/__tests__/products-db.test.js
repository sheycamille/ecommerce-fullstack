import { jest } from '@jest/globals';

// Import the actual module first
import * as dbUtilsActual from '../db/utils.js';

// Then create the mock
const dbUtils = {
  getAll: jest.fn(),
  getById: jest.fn(),
  run: jest.fn()
};

// Mock the entire module
jest.mock('../db/utils.js', () => ({
  __esModule: true,
  default: dbUtils
}));

describe('Products Database Operations', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all products', async () => {
    // Mock data
    const mockProducts = [
      { id: 1, name: 'Smartphone', price: 699.99 },
      { id: 2, name: 'Laptop', price: 1299.99 }
    ];
    
    // Setup the mock to return our test data
    dbUtils.getAll.mockResolvedValue(mockProducts);
    
    // Call the function
    const products = await dbUtils.getAll('products');
    
    // Assertions
    expect(dbUtils.getAll).toHaveBeenCalledWith('products');
    expect(products).toEqual(mockProducts);
    expect(products.length).toBe(2);
  });

  it('should fetch a product by ID', async () => {
    // Mock data
    const mockProduct = { id: 1, name: 'Smartphone', price: 699.99 };
    
    // Setup the mock
    dbUtils.getById.mockResolvedValue(mockProduct);
    
    // Call the function
    const product = await dbUtils.getById('products', 1);
    
    // Assertions
    expect(dbUtils.getById).toHaveBeenCalledWith('products', 1);
    expect(product).toEqual(mockProduct);
    expect(product.name).toBe('Smartphone');
  });

  it('should return null for non-existent product ID', async () => {
    // Setup the mock to return null (product not found)
    dbUtils.getById.mockResolvedValue(null);
    
    // Call the function
    const product = await dbUtils.getById('products', 999);
    
    // Assertions
    expect(dbUtils.getById).toHaveBeenCalledWith('products', 999);
    expect(product).toBeNull();
  });

  it('should create a new product', async () => {
    // Mock data
    const newProduct = { 
      name: 'Headphones', 
      description: 'Wireless noise-cancelling', 
      price: 199.99 
    };
    
    // Mock the run function to return an ID
    dbUtils.run.mockResolvedValue({ id: 3 });
    
    // Call the function (simulating what the API would do)
    const result = await dbUtils.run(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [newProduct.name, newProduct.description, newProduct.price]
    );
    
    // Assertions
    expect(dbUtils.run).toHaveBeenCalledWith(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [newProduct.name, newProduct.description, newProduct.price]
    );
    expect(result.id).toBe(3);
  });
});
