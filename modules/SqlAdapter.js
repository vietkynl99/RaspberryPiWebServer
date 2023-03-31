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

function checkAuthWithPass(email, password, callback) {
	let query = `SELECT permission FROM userinfo WHERE email = ? AND password = ?`;
	sqlcon.query(query, [email, password], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			callback(false, undefined)
		}
		else {
			callback(true, result)
		}
	});
}

function checkAuthWithToken(email, token, callback) {
	let query = `SELECT permission FROM userinfo WHERE email = ? AND token = ? AND lastlogin >= DATE_SUB(NOW(), INTERVAL 1 HOUR)`;
	sqlcon.query(query, [email, token], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			callback(false, undefined)
		}
		else {
			callback(true, result)
		}
	});
}

function updateToken(email, token, callback) {
	let query = `UPDATE userinfo SET token = ? , lastlogin = NOW() WHERE email = ?`;
	sqlcon.query(query, [token, email], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			callback(false, undefined)
		}
		else {
			callback(true, result)
		}
	});
}

function readUserInformation(email, callback) {
	let query = `SELECT firstname, lastname FROM userinfo WHERE email = ?`;
	sqlcon.query(query, [email], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			callback(false, undefined)
		}
		else {
			callback(true, result)
		}
	});
}

function insertToTable(table, dataName, dataValue, callback) {
	let query = `INSERT INTO ${table} (${dataName}) VALUES (${dataValue})`;
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

function updateTable(table, dataName, dataValue, callback) {
	let query = `UPDATE ${table} SET ${dataName} = ${dataValue}`;
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

function readAllFromTable(table, callback) {
	let query = `SELECT * FROM ${table}`;
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
	query,
	checkAuthWithPass,
	checkAuthWithToken,
	updateToken,
	readUserInformation,
	insertToTable,
	updateTable,
	readAllFromTable
}