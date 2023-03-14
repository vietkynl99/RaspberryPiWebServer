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
    try {
      this.#sqlcon.connect((err) => {
        if (err) {
          throw err
        }
        console.log('[SqlAdapter] Database connected!')
      });
    }
    catch (error) {
      console.log("[SqlAdapter][ERROR] Can't connect to database: " + error)
      process.exit(1)
    }
  }

  query(query, callback) {
    try {
      this.#sqlcon.query(query, (error, result) => {
        if (error) {
          throw error
        }
        callback(true, result)
      });
    }
    catch (error) {
      console.log("[SqlAdapter][ERROR] Sql query error: " + error)
      callback(false, undefined)
    }
  }

  testfunc() {
    console.log('hello from MySQL')
  }
}

module.exports = SqlAdapter;