require('dotenv').config();
const crypto = require('crypto')
const config = require('../modules/config')
const uilog = require('../modules/uiLog')
const mysql = require('mysql')
const { Pool } = require('pg')
const fs = require('fs')

var sql = undefined;

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
	if (config.usePostgreSQL) {
		sql = new Pool({
			user: process.env.PG_USER,
			host: process.env.PG_HOST,
			database: process.env.PG_DB,
			password: process.env.PG_PWD,
			port: process.env.PG_PORT
		});

		sql.on('error', (err, client) => {
			console.error('Unexpected error on idle client', err);
			process.exit(-1);
		});
	}
	else {
		sql = mysql.createConnection({
			host: process.env.MYSQL_HOST,
			port: process.env.MYSQL_PORT,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PWD,
			database: process.env.MYSQL_DB,
		});
		sql.connect((error) => {
			if (error) {
				uilog.log(uilog.Level.ERROR, 'Cannot connect to database: ' + error)
				throw error
			}
			uilog.log(uilog.Level.SQL, 'Database connected!')
		});
	}
}

function close() {
	if(config.usePostgreSQL) {
		sql.end()
	}
}

function query(query, successCallback, errorCallback) {
	sql.query(query, (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			errorCallback(error)
		}
		else {
			successCallback(config.usePostgreSQL ? result.rows : result)
		}
	});
}


function createTables() {
	const sqlFile = config.usePostgreSQL ? './modules/postgre.sql' : './modules/mysql.sql'
	fs.readFile(sqlFile, (err, data) => {
		if (err) throw err;
	
		let query = data.toString().trim();
	
		if (!query) {
			uilog.log(uilog.Level.ERROR, 'Query is empty');
			process.exit(1)
		}

		sql.query(query, (error, result) => {
			if (error) {
				uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			}
			else {
				uilog.log(uilog.Level.SQL, 'Create table successfully!!');
			}
		});
	})
}

function checkAuthWithPass(email, password, successCallback, errorCallback) {
	let query = config.usePostgreSQL ? `SELECT permission FROM userinfo WHERE email = $1 AND password = $2` :
		`SELECT permission FROM userinfo WHERE email = ? AND password = ?`
	sql.query(query, [email, password], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			errorCallback(error)
		}
		else {
			successCallback(config.usePostgreSQL ? result.rows : result)
		}
	});
}

function checkAuthWithToken(encryptedEmail, encryptedToken, successCallback, errorCallback) {
	let rawEmail = decrypte(encryptedEmail);
	let rawToken = decrypte(encryptedToken);
	let query = config.usePostgreSQL ? `SELECT permission FROM userinfo WHERE email = $1 AND token = $2 AND lastlogin >= NOW() - INTERVAL '1 hour'` :
		`SELECT permission FROM userinfo WHERE email = ? AND token = ? AND lastlogin >= DATE_SUB(NOW(), INTERVAL 1 HOUR)`
	sql.query(query, [rawEmail, rawToken], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			errorCallback(error)
		}
		else {
			successCallback(config.usePostgreSQL ? result.rows : result)
		}
	});
}

function updateToken(email, token, successCallback, errorCallback) {
	let query = config.usePostgreSQL ? `UPDATE userinfo SET token = $1 , lastlogin = NOW() WHERE email = $2` :
		`UPDATE userinfo SET token = ? , lastlogin = NOW() WHERE email = ?`
	sql.query(query, [token, email], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			errorCallback(error)
		}
		else {
			successCallback(config.usePostgreSQL ? result.rowCount : result.changedRows)
		}
	});
}

function readUserInformation(email, successCallback, errorCallback) {
	let query = config.usePostgreSQL ? `SELECT firstname, lastname FROM userinfo WHERE email = $1` :
		`SELECT firstname, lastname FROM userinfo WHERE email = ?`;
	sql.query(query, [email], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			errorCallback(error)
		}
		else {
			successCallback(config.usePostgreSQL ? result.rows : result)
		}
	});
}

function insertToTable(table, dataName, dataValue, successCallback, errorCallback) {
	let query = `INSERT INTO ${table} (${dataName}) VALUES (${dataValue})`;
	sql.query(query, (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			errorCallback(error)
		}
		else {
			successCallback(config.usePostgreSQL ? result.rows : result)
		}
	});
}

function updateTable(table, dataName, dataValue, successCallback, errorCallback) {
	let query = `UPDATE ${table} SET ${dataName} = '${dataValue}'`;
	sql.query(query, [dataName, dataValue], (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			errorCallback(error)
		}
		else {
			successCallback(config.usePostgreSQL ? result.rowCount : result.changedRows)
		}
	});
}

function readAllFromTable(table, limit, successCallback, errorCallback) {
	let query;
	if (limit) {
		query = `SELECT * FROM ${table} ORDER BY id DESC LIMIT ${limit}`;
	}
	else {
		query = `SELECT * FROM ${table}`;
	}
	sql.query(query, (error, result) => {
		if (error) {
			uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${error}`)
			errorCallback(error)
		}
		else {
			successCallback(config.usePostgreSQL ? result.rows : result)
		}
	});
}


module.exports = {
	encrypte,
	decrypte,
	generateToken,
	UserPermission,
	EventType,
	removeSpecialCharacter,
	connect,
	close,
	query,
	createTables,
	checkAuthWithPass,
	checkAuthWithToken,
	updateToken,
	readUserInformation,
	insertToTable,
	updateTable,
	readAllFromTable
}