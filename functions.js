class viewAllDepartments {
  constructor(db) {
    this.db = db;
  }
  render(){
    db.query('SELECT * FROM department', function (err, rows) {
       if(err){
         console.error('Error:', err);
       }else{
         console.table(rows);
       }
    });
  }
};

class viewAllRoles {
  constructor(db) {
    this.db = db;
  }
  render(){
    db.query(`SELECT r.id, r.title, d.name AS department, r.salary
              FROM role AS r 
              JOIN department AS d 
              ON r.department_id = d.id`, 
       function (err, rows) {
         if(err){
           console.error('Error:', err);
         }else{
           console.table(rows);
         }
    });
  }
};

class viewAllEmployees {
  constructor(db) {
    this.db = db;
  }
  render(){
    db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
              FROM employee AS e
              JOIN role AS r ON e.role_id = r.id
              JOIN department AS d ON r.department_id = d.id
              LEFT JOIN employee AS m ON e.manager_id = m.id`,   
       function (err, rows) {
         if(err){
           console.error('Error:', err);
         }else{
           console.table(rows);
         }
    });
  }
};

class addDepartment {
  constructor(db) {
    this.db = db;
  }
  
  inputAddDepartment(){
    inquirer.prompt([
      {
        type: 'input',
        name: 'addDepartmentInput',
        message: 'What is the name of the department?',
      }
    ])
    
    .then(({addDepartmentInput}) => {
        db.query(`INSERT INTO department (name)
                    VALUES (?);`, [addDepartmentInput],  
           function (err, result) {
             if(err){
                console.error('Error:', err);
             }else{
                console.log(`Added ${addDepartmentInput} to the database`);
             }           
        });
    });
  }
};

class addRole {
  constructor(db) {
    this.db = db;
  }
  
  inputAddRole(){
    db.query('SELECT name FROM department', function (err, results) {
      if (err) { 
        console.error('Error:', err);
        return;
      }
      
      // Extract an array of department names from the query results
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
        db.query(`SELECT id FROM department WHERE name = ?`, [roleDepartment], function (err, results) {
            if (err) {
              console.error('Error:', err);
              return;
            }
        
            const departmentId = results[0].id;

            db.query(`INSERT INTO role (title, department_id, salary)
                      VALUES (?, ?, ?);`, [roleName, departmentId, roleSalary],  
              function (err, result) {
                if(err){
                  console.error('Error:', err);
                }else{
                  console.log(`Added ${roleName} to the database`);
                }           
            });
        });
      });
    });
  }
};
