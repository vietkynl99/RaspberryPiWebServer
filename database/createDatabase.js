// connect to database
var SqlAdapter = require('../modules/SqlAdapter')
var sqlAdapter = new SqlAdapter()
sqlAdapter.connect()


const fs = require('fs')
fs.readFile('kynlweb.sql', (err, data) => {
    if (err) throw err;

    let queryArray = data.toString().split(';');

    for (let i = 0; i < queryArray.length - 1; i++) {
        let query = queryArray[i].trim() + ';';
        // console.log((i + 1 ) + '. ' + query);

        sqlAdapter.query(query, function (success, result) {
            if (success == false) {
                console.log('[ERROR] SQL query error: ' + query);
                // process.exit()
            }
        })
    }
    console.log('\nDone!');
    process.exit()
})