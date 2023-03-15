var mysql = require('mysql');

class SqlAdapter {
  #sqlcon;

  constructor() {
    this.#sqlcon = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "KynlMySQL1103@!",
      database: "kynlwebdb"
    });
  }
  
  connect() {
      this.#sqlcon.connect((err) => {
        if (err) {
          console.log('[SqlAdapter][ERROR] Cannot connect to database: ' + error)
          throw err
        }
        console.log('[SqlAdapter] Database connected!')
      });
  }

  query(query, callback) {
      this.#sqlcon.query(query, (error, result) => {
        if (error) {
          console.log('[SqlAdapter][ERROR] Sql query error: ' + error)
          callback(false, undefined)
        }
        else {
          callback(true, result)
        }
      });
  }
}

module.exports = SqlAdapter;