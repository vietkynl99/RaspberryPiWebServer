// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()


const fs = require('fs')
fs.readFile('kynlweb.sql', (err, data) => {
    if (err) throw err;

    // remove space and comment
    let text = data.toString().replace(/[\s]*[--]+.+[\r\n]+/gm, "").trim();
    // remove last ;
    text = text.substring(0, text.length -1)
    let queryArray = text.split(';');

    for (let i = 0; i < queryArray.length; i++) {
        let query = queryArray[i].trim();
        // console.log((i + 1) + '. ' + query);
        sqlAdapter.query(query, function (success, result) {
            if (success == false) {
                console.log('[ERROR] SQL query error: index=' + (i+1) + ' query=' + query);
                process.exit()
            }
            if (i === queryArray.length - 1) {
                console.log('\nExecute ' + queryArray.length + ' queries successfully!!');
                process.exit()
            }
        })
    }
})