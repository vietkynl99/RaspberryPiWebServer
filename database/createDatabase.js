// connect to database
var uilog = require('../modules/uiLog')
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()


const fs = require('fs')
fs.readFile('kynlweb.sql', (err, data) => {
    if (err) throw err;

    let text = data.toString().trim();
    // remove space and comment
    text = text.replace(/^[\s]*[--]+.*[\s\r\n]+/gm, "").trim();
    // remove last ;
    if (text.at(text.length - 1) == ';') {
        text = text.substring(0, text.length - 1)
    }
    let queryArray = text.split(';');

    for (let i = 0; i < queryArray.length; i++) {
        let query = queryArray[i].trim();
        // uilog.log(uilog.Level.SQL, '\n' + (i + 1) + '. ' + query);
        sqlAdapter.query(query, function (success, result) {
            if (success == false) {
                uilog.log(uilog.Level.ERROR, 'SQL query error: index=' + (i + 1) + ' query=' + query);
                process.exit()
            }
            if (i === queryArray.length - 1) {
                uilog.log(uilog.Level.SQL, 'Execute ' + queryArray.length + ' queries successfully!!');
                process.exit()
            }
        })
    }
})