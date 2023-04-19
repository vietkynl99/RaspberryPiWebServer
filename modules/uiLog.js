const moment = require('moment');

const red = '\x1b[31m'
const green = '\x1b[32m'
const yellow = '\x1b[33m'
const blue = '\x1b[34m'
const purple = '\x1b[35m'
const cyan = '\x1b[36m'
const white = '\x1b[37m'

const Level = {
	ERROR: red,
	LOG: white,
	SYSTEM: green,
	CLIENT: yellow,
	SERIALPORT: blue,
	SQL: cyan,
	MD: purple
}

function log(level, message) {
	const error = new Error();
	const stack = error.stack.split("\n")[2].trim().replace(/\\/g,'/');
	let functionName = stack.match(/ .+ /);
	if (functionName) {
		functionName = functionName[0].trim();
	}
	functionName = functionName + '|' + stack.match(/\/[^\/]+(?=:)/)[0].replace(/\//g, '');
	const levelName = Object.keys(Level).find(key => Level[key] === level);
	const date = new Date();
	const formattedDateTime = moment(date).format('DD/MM/YYYY HH:mm:ss');

	console.log(`${level}[${formattedDateTime}][${levelName}][${functionName}]`, message, '\x1b[0m');
}

module.exports = {
	Level,
	log
}