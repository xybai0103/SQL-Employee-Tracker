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

function askOption() {
  inquirer.prompt(options).then((answers) => {
      const selectedOption = answers.selectedOption;
      if(selectedOption = 'View All Employees'){
        viewAllEmployees();
      } else if(selectedOption = 'Add Employee'){
        addEmployee();
      } else if(selectedOption = 'Update Employee Role'){
        updateEmployeeRole();
      } else if(selectedOption = 'View All Roles'){
        viewAllRoles();
      } else if(selectedOption = 'Add Role'){
        addRole();
      } else if(selectedOption = 'View All Departments'){
        viewAllDepartments();
      } else if(selectedOption = 'Add Department'){
        addDepartment();
      } else{
        Quit();
      } 
  });
  // Prompt the user to select another option
  askOption();
}

askOption();