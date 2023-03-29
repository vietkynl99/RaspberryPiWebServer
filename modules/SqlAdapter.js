var uilog = require('../modules/uiLog')
var mysql = require('mysql');
var sqlcon = undefined;

const UserPermission = {
	ADMIN: 1,
    USER: 2
}
const EventType = {
	LOG_IN: 0,
	LOG_OUT: 1,
	SIGN_UP: 2
}

function removeSpecialCharacter(str) {
	if (str) {
		str = str.trim();
		str = str.replace(/[^\x00-\x7F]/g, "");
		str = str.replace(/['"`]/g, "");
	}
	return str;
}

function connect() {
	sqlcon = mysql.createConnection({
		host: "localhost",
		port: 3306,
		user: "root",
		password: "KynlMySQL1103@!",
		database: "kynlwebdb"
	});
	sqlcon.connect((error) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, 'Cannot connect to database: ' + error)
			throw error
		}
		uilog.log(uilog.Level.SQL, 'Database connected!')
	});
}

function query(query, callback) {
	sqlcon.query(query, (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			callback(false, undefined)
		}
		else {
			callback(true, result)
		}
	});
}


module.exports = {
	UserPermission,
	EventType,
	removeSpecialCharacter,
	connect,
	query
};