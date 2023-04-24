// connect to database
const uilog = require('../modules/uiLog')
const sqlAdapter = require('../modules/sqlAdapter')
const config = require('../modules/config')
const { Pool } = require('pg');
const fs = require('fs')

const sqlFile = config.usePostgreSQL ? 'postgre.sql' : 'mysql.sql'

sqlAdapter.connect()

fs.readFile(sqlFile, (err, data) => {
    if (err) throw err;

    let query = data.toString().trim();

    if (!query) {
        uilog.log(uilog.Level.ERROR, 'Query is empty');
        process.exit(1)
    }

    sqlAdapter.query(query,
        function successCallback(result) {
            uilog.log(uilog.Level.SQL, 'Execute queries successfully!!');
            process.exit(0)
        },
        function errorCallback(error) {
            uilog.log(uilog.Level.ERROR, `Sql query error:\n\tquery: ${query}\n\terror: ${err}`)
            throw err
        });
})