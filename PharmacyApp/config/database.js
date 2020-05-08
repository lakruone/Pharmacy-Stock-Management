const mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 20, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'pharmacy_data',
    debug    :  false
});

// var pool      =    mysql.createPool({
//     connectionLimit : 20, //important
//     host     : 'us-cdbr-east-06.cleardb.net',
//     user     : 'b37be61e71e028',
//     password : 'e5a28d87',
//     database : 'heroku_acf56647ca4b94d',
//     debug    :  false
// });


module.exports =pool;
