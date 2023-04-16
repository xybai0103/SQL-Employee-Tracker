/*
- npm init
- npm i inquirer
- npm i mysql2/promise
- install console.table
- create database connection (make sure it runs)
   -make sure database name matches db we are creating
- create schema.sql and run it.
- create seeds.swl file and run it.
- npm i dotenv
- a separate file that contains functions for performing specific SQL queries 
*/
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

function viewAllEmployees(){
  const questions= {
    type: 'input',
    name: '',
    message: ''
  };
  
  inquirer.prompt(questions).then((answers) => {
    console.table(``);
    console.log(``);
  });
}


function askOption() {
  inquirer.prompt(options).then((answers) => {
      const selectedOption = answers.selectedOption;
      if(selectedOption = 'View All Employees'){
        viewAllEmployees();
      } else if(selectedOption = 'Add Employee'){
        addEmployees();
      }
  });
  // Prompt the user to select another option
  askOption();
}

askOption();