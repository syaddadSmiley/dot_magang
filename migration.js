var mysql = require('mysql2');
var migration = require('mysql-migrations');

var connection = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'ubisniz',
    password: '@Ubis20Niz22',
    database: 'ubisniz22_db'
});

migration.init(connection, __dirname + '/migrations', function () {
    console.log("finished running migrations");
});