// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()


const fs = require('fs')
fs.readFile('kynlweb.sql', (err, data) => {
    if (err) throw err;

    let queryArray = data.toString().split(';');

    for (let i = 0; i <= queryArray.length - 2; i++) {
        let query = queryArray[i].trim() + ';';
        // console.log((i + 1 ) + '. ' + query);

        sqlAdapter.query(query, function (success, result) {
            if (success == false) {
                console.log('[ERROR] SQL query error: ' + query);
                process.exit()
            }
            if (i === queryArray.length - 2) {
                console.log('\nDone!');
                process.exit()
            }
        })
    }
})