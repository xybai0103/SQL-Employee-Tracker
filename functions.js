// Import packages
const inquirer = require('inquirer');

class ViewAllDepartments {
  constructor(db) {
    this.db = db;
  }
  render(){
    return new Promise((resolve, reject) => {
      this.db.query('SELECT * FROM department', function (err, rows) {
        if(err){
          console.error('Error:', err);
          reject(err);
        }else{
          console.table(rows);
          resolve();
        }
      });
    });
  }
};


class ViewAllRoles {
  constructor(db) {
    this.db = db;
  }
  render(){
    return new Promise((resolve, reject) => {
      this.db.query(`SELECT r.id, r.title, d.name AS department, r.salary
                FROM role AS r 
                JOIN department AS d 
                ON r.department_id = d.id`, 
        function (err, rows) {
          if(err){
            console.error('Error:', err);
            reject(err);
          }else{
            console.table(rows);
            resolve();
          }
      });
    });
  }
};


class ViewAllEmployees {
  constructor(db) {
    this.db = db;
  }
  render(){
    return new Promise((resolve, reject) => {
      this.db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employee AS e
                JOIN role AS r ON e.role_id = r.id
                JOIN department AS d ON r.department_id = d.id
                LEFT JOIN employee AS m ON e.manager_id = m.id`,   
        function (err, rows) {
          if(err){
            console.error('Error:', err);
            reject(err);
          }else{
            console.table(rows);
            resolve();
          }
      });
    });
  }
};


class AddDepartment {
  constructor(db) {
    this.db = db;
  }
  
  render(){
    return new Promise((resolve, reject) => {
      inquirer.prompt([
        {
          type: 'input',
          name: 'addDepartmentInput',
          message: 'What is the name of the department?',
        }
      ])
      
      .then(({addDepartmentInput}) => {
        this.db.query(`INSERT INTO department (name)
                      VALUES (?);`, [addDepartmentInput],  
            function (err, result) {
              if(err){
                  console.error('Error:', err);
                  reject(err);
              }else{
                  console.log(`Added ${addDepartmentInput} to the database`);
                  resolve();
              }           
          });
      });
    });
  }
};


class AddRole {
  constructor(db) {
    this.db = db;
  }
  
  render(){
    // Save the `this` context for nested functions to use
    const self = this; 

    return new Promise((resolve, reject) => {
      self.db.query('SELECT name FROM department', function (err, results) {
        if (err) { 
          console.error('Error:', err);
          reject(err);
          return;
        }
        
        // Extract an array of department names from the query results for users to choose from
        const departmentNames = results.map((result) => result.name);

        inquirer.prompt([
          {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?',
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?',
          },
          {
            type: 'list',
            name: 'roleDepartment',
            message: 'Which department does the role belong to?',
            choices: departmentNames,
          },
        ])
        
        .then(({roleName, roleSalary, roleDepartment}) => {
          // Get the id of the department of the added role that the user input to insert into table role
          self.db.query(`SELECT id FROM department WHERE name = ?`, [roleDepartment], function (err, results) {
              if (err) {
                console.error('Error:', err);
                reject(err);
                return;
              }
              //results is an array containing one object [{id = ...}]
              const departmentId = results[0].id;

              self.db.query(`INSERT INTO role (title, department_id, salary)
                        VALUES (?, ?, ?);`, [roleName, departmentId, roleSalary],  
                function (err, result) {
                  if(err){
                    console.error('Error:', err);
                    reject(err);
                  }else{
                    console.log(`Added ${roleName} to the database`);
                    resolve();
                  }           
              });
          });
        });
      });
    });
  }
};


class AddEmployee {
  constructor(db) {
    this.db = db;
  }
  
  render(){
    // Save the `this` context for nested functions to use
    const self = this; 

    return new Promise((resolve, reject) => {
      self.db.query(`SELECT r.title, CONCAT(e.first_name, ' ', e.last_name) AS employee
                FROM employee AS e
                JOIN role AS r ON e.role_id = r.id`,
        function (err, results) {
          if (err) { 
            console.error('Error:', err);
            reject(err);
            return;
          }
        
          // Extract an array of title of roles from the query results
          const roleNames = results.map((result) => result.title);
          // Extract an array of employees' names from the query results
          const employeeNames = results.map((result) => result.employee);
          employeeNames.push('None');

          inquirer.prompt([
            {
              type: 'input',
              name: 'firstName',
              message: "What is the employee's first name?",
            },
            {
              type: 'input',
              name: 'lastName',
              message: "What is the employee's last name?",
            },
            {
              type: 'list',
              name: 'employeeRole',
              message: "What is the employee's role?",
              choices: roleNames,
            },
            {
              type: 'list',
              name: 'employeeManager',
              message: "Who is the employee's manager?",
              choices: employeeNames,
            },
          ])
        
          .then(({firstName, lastName, employeeRole, employeeManager}) => {
            // Get the id of the role of the added employee that the user input to insert into table employee
            self.db.query(`SELECT id FROM role WHERE title = ?`, [employeeRole], function (err, results) {
              if (err) {
                console.error('Error:', err);
                reject(err);
                return;
              }
              //results is an array containing one object [{id = ...}]
              const roleId = results[0].id;

              // Get the id of the added employee's manager to insert into table employee if the user chose a name
              if (employeeManager !== 'None') {
                // split the managerName into an array containing its firstName and lastName
                const managerName = employeeManager.split(' ');
                const managerFirstName = managerName[0];
                const managerLastName = managerName[1];
                self.db.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [managerFirstName, managerLastName], function (err, results) {
                  if (err) {
                    console.error('Error:', err);
                    reject(err);
                    return;
                  }
                  //results is an array containing one object [{id = ...}]
                  const managerId = results[0].id;

                  // Insert the added employee into the database
                  self.db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?);`, [firstName, lastName, roleId, managerId],  
                    function (err, result) {
                      if(err){
                        console.error('Error:', err);
                        reject(err);
                      }else{
                        console.log(`Added ${firstName} ${lastName} to the database`);
                        resolve();
                      }           
                  });
                });
              } 
              /* If the user chose 'None' for the added employee's manager,
                no value is provided for manager_id, the column will be 
                automatically set to NULL in the table.*/
              else {
                self.db.query(`INSERT INTO employee (first_name, last_name, role_id)
                          VALUES (?, ?, ?, ?);`, [firstName, lastName, roleId],  
                  function (err, result) {
                    if(err){
                      console.error('Error:', err);
                      reject(err);
                    }else{
                      console.log(`Added ${firstName} ${lastName} to the database`);
                      resolve();
                    }           
                });
              }
            });
        });
      });
    });
  }
};


class UpdateEmployeeRole {
  constructor(db) {
    this.db = db;
  }
  
  render(){
    // Save the `this` context for nested functions to use
    const self = this; 

    return new Promise((resolve, reject) => {
      self.db.query(`SELECT r.title, CONCAT(e.first_name, ' ', e.last_name) AS employee
                FROM employee AS e
                JOIN role AS r ON e.role_id = r.id`,
        function (err, results) {
          if (err) { 
            console.error('Error:', err);
            reject(err);
            return;
          }
        
          // Extract an array of title of roles from the query results
          const roleNames = results.map((result) => result.title);
          // Extract an array of employees' names from the query results
          const employeeNames = results.map((result) => result.employee);

          inquirer.prompt([
            {
              type: 'list',
              name: 'employeeName',
              message: "Which employee's role do you want to update?",
              choices: employeeNames,
            },
            {
              type: 'list',
              name: 'employeeNewRole',
              message: 'Which role do you want to assign the selected employee?',
              choices: roleNames,
            },
          ])
        
          .then(({employeeName, employeeNewRole}) => {
            // Get the id of the updated role of the employee that the user input
            self.db.query(`SELECT id FROM role WHERE title = ?`, [employeeNewRole], function (err, results) {
              if (err) {
                console.error('Error:', err);
                reject(err);
                return;
              }
              //results is an array containing one object [{id = ...}]
              const roleId = results[0].id;

              const employeeNameSplit = employeeName.split(' ');
                const employeeFirstName = employeeNameSplit[0];
                const employeeLastName = employeeNameSplit[1];
                self.db.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [employeeFirstName, employeeLastName], function (err, results) {
                  if (err) {
                    console.error('Error:', err);
                    reject(err);
                    return;
                  }
                  //results is an array containing one object [{id = ...}]
                  const employeeId = results[0].id;

                  self.db.query(`UPDATE employee
                            SET role_id = ?
                            WHERE id = ?;`, [roleId, employeeId],  
                    function (err, result) {
                      if(err){
                        console.error('Error:', err);
                        reject(err);
                      }else{
                        console.log(`Updated employee's role`);
                        resolve();
                      }           
                  });
                });
            });
        });
      });
    });
  }
};

module.exports = {ViewAllDepartments, ViewAllRoles, ViewAllEmployees, AddDepartment, AddRole, AddEmployee, UpdateEmployeeRole};
