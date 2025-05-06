import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db/config.js';
import dbUtils from './db/utils.js';
import chalk from 'chalk';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // In production, use environment variables

// Create a simple logger
const logger = {
  info: (message) => console.log(chalk.blue(`[INFO] ${new Date().toISOString()} - ${message}`)),
  success: (message) => console.log(chalk.green(`[SUCCESS] ${new Date().toISOString()} - ${message}`)),
  warn: (message) => console.log(chalk.yellow(`[WARN] ${new Date().toISOString()} - ${message}`)),
  error: (message, error) => {
    console.error(chalk.red(`[ERROR] ${new Date().toISOString()} - ${message}`));
    if (error) {
      console.error(chalk.red(error.stack || error));
    }
  },
  request: (req) => console.log(chalk.cyan(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.url}`))
};

// Add request logging middleware
app.use((req, res, next) => {
  logger.request(req);
  next();
});

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/api/login', async (req, res) => {
  logger.info(`Login attempt for user: ${req.body.email}`);
  
  try {
    const { email, password } = req.body;
    
    // Get user from database
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          logger.error('Database error during login', err);
          reject(err);
        }
        resolve(row);
      });
    });

    if (!user) {
      logger.warn(`Login failed: User not found - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for user - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    logger.success(`Login successful for user: ${email}`);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await dbUtils.getAll('products');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await dbUtils.getById('products', req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    
    // Start a transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      // Create order
      db.run(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [userId, totalAmount],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ message: 'Error creating order' });
          }
          
          const orderId = this.lastID;
          const orderItemsStmt = db.prepare(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
          );
          
          // Add order items
          let hasError = false;
          items.forEach(item => {
            orderItemsStmt.run(
              [orderId, item.productId, item.quantity, item.price],
              (err) => {
                if (err) {
                  hasError = true;
                }
              }
            );
          });
          
          orderItemsStmt.finalize();
          
          if (hasError) {
            db.run('ROLLBACK');
            return res.status(500).json({ message: 'Error adding order items' });
          }
          
          db.run('COMMIT');
          res.status(201).json({ orderId, message: 'Order created successfully' });
        }
      );
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image_url, stock } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    const result = await dbUtils.run(
      'INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', price, image_url || 'https://via.placeholder.com/300', stock || 0]
    );
    
    res.status(201).json({ 
      id: result.id, 
      name, 
      description, 
      price, 
      image_url, 
      stock,
      message: 'Product added successfully' 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const product = await dbUtils.getById('products', id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await dbUtils.run('DELETE FROM products WHERE id = ?', [id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, stock } = req.body;
    
    // Check if product exists
    const product = await dbUtils.getById('products', id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    await dbUtils.run(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ? WHERE id = ?',
      [name, description || '', price, image_url || 'https://via.placeholder.com/300', stock || 0, id]
    );
    
    res.json({ 
      id: parseInt(id), 
      name, 
      description, 
      price, 
      image_url, 
      stock,
      message: 'Product updated successfully' 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the app for testing
export default app;

// Start the server if this file is run directly
if (import.meta.url.startsWith('file:')) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`API available at http://localhost:${PORT}/api`);
  });
}






