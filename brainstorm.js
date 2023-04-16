/*
- npm init
- npm i inquirer
- npm i mysql2/promise
- install console.table
- npm i dotenv
- create database connection (make sure it runs)
   -make sure database name matches db we are creating
- create schema.sql and run it.
- create seeds.swl file and run it.

- a separate file that contains functions for performing specific SQL queries 
*/
db.promise().query('SELECT * FROM users WHERE id = ?', [1])
  .then(([rows, fields]) => {
    // do something with the results
    console.log(rows);
  })
  .catch((error) => {
    // handle the error
    console.error(error);
  })
  .finally(() => {
    // release the database connection
    db.end();
});

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