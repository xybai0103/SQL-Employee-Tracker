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
