const crypto = require('crypto');
var uilog = require('../modules/uiLog')
var mysql = require('mysql');
var sqlcon = undefined;

// crypto
const crypto_key = crypto.randomBytes(32);
const crypto_iv = crypto.randomBytes(16);

function encrypte(data) {
	let cipher = crypto.createCipheriv('aes-256-cbc', crypto_key, crypto_iv);
	let encrypted = cipher.update(data, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
}

function decrypte(data) {
	try {
		let decipher = crypto.createDecipheriv('aes-256-cbc', crypto_key, crypto_iv);
		let decrypted = decipher.update(data, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	} catch (error) {
		return '';
	}
}

function generateToken() {
	let token = crypto.randomBytes(20).toString('hex');
	let encrypted = encrypte(token);
	return { raw: token, encrypted: encrypted }
}

// sql function
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
	// sqlcon = mysql.createConnection({
	// 	host: "localhost",
	// 	port: 3306,
	// 	user: "root",
	// 	password: "KynlMySQL1103@!1",
	// 	database: "kynlwebdb"
	// });
	// sqlcon.connect((error) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, 'Cannot connect to database: ' + error)
	// 		throw error
	// 	}
	// 	uilog.log(uilog.Level.SQL, 'Database connected!')
	// });
}

function query(query, successCallback, errorCallback) {
	// sqlcon.query(query, (error, result) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
	// 		errorCallback(error)
	// 	}
	// 	else {
	// 		successCallback(result)
	// 	}
	// });
}

function checkAuthWithPass(email, password, successCallback, errorCallback) {
	// let query = `SELECT permission FROM userinfo WHERE email = ? AND password = ?`;
	// sqlcon.query(query, [email, password], (error, result) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
	// 		errorCallback(error)
	// 	}
	// 	else {
	// 		successCallback(result)
	// 	}
	// });
}

function checkAuthWithToken(encryptedEmail, encryptedToken, successCallback, errorCallback) {
	// let rawEmail = decrypte(encryptedEmail);
	// let rawToken = decrypte(encryptedToken);
	// let query = `SELECT permission FROM userinfo WHERE email = ? AND token = ? AND lastlogin >= DATE_SUB(NOW(), INTERVAL 1 HOUR)`;
	// sqlcon.query(query, [rawEmail, rawToken], (error, result) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
	// 		errorCallback(error)
	// 	}
	// 	else {
	// 		successCallback(result)
	// 	}
	// });
}

function updateToken(email, token, successCallback, errorCallback) {
	// let query = `UPDATE userinfo SET token = ? , lastlogin = NOW() WHERE email = ?`;
	// sqlcon.query(query, [token, email], (error, result) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
	// 		errorCallback(error)
	// 	}
	// 	else {
	// 		successCallback(result)
	// 	}
	// });
}

function readUserInformation(email, successCallback, errorCallback) {
	// let query = `SELECT firstname, lastname FROM userinfo WHERE email = ?`;
	// sqlcon.query(query, [email], (error, result) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
	// 		errorCallback(error)
	// 	}
	// 	else {
	// 		successCallback(result)
	// 	}
	// });
}

function insertToTable(table, dataName, dataValue, successCallback, errorCallback) {
	// let query = `INSERT INTO ${table} (${dataName}) VALUES (${dataValue})`;
	// sqlcon.query(query, (error, result) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
	// 		errorCallback(error)
	// 	}
	// 	else {
	// 		successCallback(result)
	// 	}
	// });
}

function updateTable(table, dataName, dataValue, successCallback, errorCallback) {
	// let query = `UPDATE ${table} SET ${dataName} = '${dataValue}'`;
	// sqlcon.query(query, [dataName, dataValue], (error, result) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
	// 		errorCallback(error)
	// 	}
	// 	else {
	// 		successCallback(result)
	// 	}
	// });
}

function readAllFromTable(table, limit, successCallback, errorCallback) {
	// let query;
	// if (limit) {
	// 	query = `SELECT * FROM ${table} ORDER BY id DESC LIMIT ${limit}`;
	// }
	// else {
	// 	query = `SELECT * FROM ${table}`;
	// }
	// sqlcon.query(query, (error, result) => {
	// 	if (error) {
	// 		uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
	// 		errorCallback(error)
	// 	}
	// 	else {
	// 		successCallback(result)
	// 	}
	// });
}


module.exports = {
	encrypte,
	decrypte,
	generateToken,
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