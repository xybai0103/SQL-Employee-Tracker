// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PW,
      database: '..._db'
    },
    console.log(`Connected to the ... database.`)
  );