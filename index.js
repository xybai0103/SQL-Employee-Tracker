// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

// Import function classes
const {ViewAllDepartments, ViewAllRoles, ViewAllEmployees, AddDepartment, AddRole, AddEmployee, UpdateEmployeeRole} = require('./functions');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PW,
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

const options = [
  {
    type: 'list',
    name: 'selectedOption',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Quit'
    ]
  }
];

async function askOption() {
  try{
    const answers = await inquirer.prompt(options);
    
    const selectedOption = answers.selectedOption;

    let newClass;

    if(selectedOption === 'View All Employees'){
      newClass = new ViewAllEmployees(db);
    } else if(selectedOption === 'Add Employee'){
      newClass = new AddEmployee(db);
    } else if(selectedOption === 'Update Employee Role'){
      newClass = new UpdateEmployeeRole(db);
    } else if(selectedOption === 'View All Roles'){
      newClass = new ViewAllRoles(db);
    } else if(selectedOption === 'Add Role'){
      newClass = new AddRole(db);
    } else if(selectedOption === 'View All Departments'){
      newClass = new ViewAllDepartments(db);
    } else if(selectedOption === 'Add Department'){
      newClass = new AddDepartment(db);
    } else{
      //exit the node.js if user chose 'quit'
      process.exit();
    }
    await newClass.render();
    // Prompt the user to select another option
    askOption();
  } catch(err) {
    console.error('Error:', err);
  }
}

askOption();