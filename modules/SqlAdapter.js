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

	removeSpecialCharacter(str) {
		if (str) {
			str = str.trim();
			str = str.replace(/[^\x00-\x7F]/g, "");
			str = str.replace(/['"`]/g, "");
		}
		return str;
	}

	connect() {
		this.#sqlcon.connect((error) => {
			if (error) {
				console.log('[SqlAdapter][ERROR] Cannot connect to database: ' + error)
				throw error
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