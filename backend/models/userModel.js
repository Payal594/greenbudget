const db = require('../config/db');

const createUser = (name, email, password,role, callback) => {
  db.query('INSERT INTO users (name, email, password,role) VALUES (?, ?, ?,?)', [name, email, password,role], callback);
};

const findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

module.exports = { createUser, findUserByEmail };
