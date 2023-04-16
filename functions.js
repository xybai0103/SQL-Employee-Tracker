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


