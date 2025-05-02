import db from './config.js';
import bcrypt from 'bcrypt';

// Seed the database with initial data
async function seedDatabase() {
  try {
    // Add a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    db.run(`
      INSERT OR IGNORE INTO users (email, password, name)
      VALUES ('test@example.com', ?, 'Test User')
    `, [hashedPassword]);

    // Add some products
    const products = [
      {
        name: 'Smartphone',
        description: 'Latest model with high-resolution camera',
        price: 699.99,
        image_url: 'https://via.placeholder.com/300',
        stock: 50
      },
      {
        name: 'Laptop',
        description: 'Powerful laptop for work and gaming',
        price: 1299.99,
        image_url: 'https://via.placeholder.com/300',
        stock: 30
      },
      {
        name: 'Headphones',
        description: 'Noise-cancelling wireless headphones',
        price: 199.99,
        image_url: 'https://via.placeholder.com/300',
        stock: 100
      },
      {
        name: 'Smartwatch',
        description: 'Track your fitness and stay connected',
        price: 249.99,
        image_url: 'https://via.placeholder.com/300',
        stock: 45
      }
    ];

    // Insert products
    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, image_url, stock)
      VALUES (?, ?, ?, ?, ?)
    `);

    products.forEach(product => {
      stmt.run(
        product.name,
        product.description,
        product.price,
        product.image_url,
        product.stock
      );
    });

    stmt.finalize();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();


