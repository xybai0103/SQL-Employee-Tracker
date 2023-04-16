class viewAllDepartments {
  constructor(db) {
    this.db = db;
  }
  render(){
    db.query('SELECT * FROM department', function (err, rows) {
       console.table(rows);
    });
  }
};

class viewAllRoles {
  constructor(db) {
    this.db = db;
  }
  render(){
    db.query('SELECT r.id, r.title, d.name AS department, r.salary FROM role AS r JOIN department AS d ON r.department_id = d.id', function (err, rows) {
       console.table(rows);
    });
  }
};
