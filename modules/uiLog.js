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
  CTRL: purple
}

function log(level, message) {
  const error = new Error();
  const stack = error.stack.split("\n")[2].trim();
  const functionName = stack.split(' ')[1] + '|' + stack.match(/\\[^\\]+(?=:)/gm)[0].replace('\\', '');
  const levelName = Object.keys(Level).find(key => Level[key] === level);
  console.log(level, `[${new Date().toLocaleString()}][${levelName}][${functionName}] ${message}`, '\x1b[0m');
}

module.exports = {
	Level,
	log
}