const mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 20, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'pharmacy_data',
    debug    :  false
});


module.exports =pool;
