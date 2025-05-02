import db from './config.js';

// Promisify database operations
const dbUtils = {
  // Get all rows from a table
  getAll: (table) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Get a single row by id
  getById: (table, id) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get rows by a specific field value
  getByField: (table, field, value) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${table} WHERE ${field} = ?`, [value], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Run a custom query
  run: (query, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }
};

export default dbUtils;