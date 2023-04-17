// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
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

function askOption() {
  /*the 'return' statement ensures that the askOption() function returns
    a promise that can be used to handle the results of the inquirer prompts*/
  return inquirer.prompt(options).then((answers) => {
      const selectedOption = answers.selectedOption;

      let newClass;

      if(selectedOption = 'View All Employees'){
        newClass = new ViewAllEmployees(db);
        newClass.render();
      } else if(selectedOption = 'Add Employee'){
        newClass = new AddEmployee(db);
        newClass.render();
      } else if(selectedOption = 'Update Employee Role'){
        newClass = new UpdateEmployeeRole(db);
        newClass.render();
      } else if(selectedOption = 'View All Roles'){
        newClass = new ViewAllRoles(db);
        newClass.render();
      } else if(selectedOption = 'Add Role'){
        newClass = new AddRole(db);
        newClass.render();
      } else if(selectedOption = 'View All Departments'){
        newClass = new ViewAllDepartments(db);
        newClass.render();
      } else if(selectedOption = 'Add Department'){
        newClass = new AddDepartment(db);
        newClass.render();
      } else{
        //exit the node.js if user chose 'quit'
        process.exit();
      } 
  });
  // Prompt the user to select another option
  askOption();
}

askOption();