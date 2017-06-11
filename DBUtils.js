let Connection = require('tedious').Connection;
let Request = require('tedious').Request;
let TYPES = require('tedious').TYPES;

//------------------------------------  S E R V E R   C O N F I G  -----------------------------------------------------
let config = {
    userName: 'adminlogin',
    password: 'Eitan2703',
    server: 'shopdbserver.database.windows.net',
    requestTimeout: 15000,
    options: {encrypt: true, database: 'Shop'}
};

let connection;
//--------------------------------------------  S E L E C T  -----------------------------------------------------------
exports.Select = function(query) {
    return new Promise(function(resolve,reject) {
        let ans = [];
        let properties = [];
        connection = new Connection(config);
        connection.on('connect', function(err) {
            let requestDB;
            if (err) {
                console.error('[SELECT] Error in the connection process: ' + err.message);
                reject(err);
            }
            console.log('[SELECT] Connection: ON');

            requestDB = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });

            requestDB.on('columnMetadata', function (columns) {
                columns.forEach(function (column) {
                    if (null != column.colName)
                        properties.push(column.colName);
                });
            });

            requestDB.on('row', function (row) {
                let item = {};
                for (i=0; i<row.length; i++) {
                    item[properties[i]] = row[i].value;
                }
                ans.push(item);
            });

            requestDB.on('requestCompleted', function () {
                console.log('[SELECT] Request Completed: '+ requestDB.rowCount + ' Row(s) Returned');
                console.log(ans);
                connection.close();
                resolve(ans);
            });

            connection.execSql(requestDB);
        });
    });
};
//--------------------------------------------  I N S E R T  -----------------------------------------------------------
exports.Insert = function(query) {
    return new Promise(function(resolve,reject) {
        let ans;
        connection = new Connection(config);

        connection.on('connect', function(err) {
            let requestDB;
            if (err) {
                console.error('[INSERT] Error in the connection process: ' + err.message);
                reject(err);
            }

            console.log('[INSERT] Connection: ON');
            requestDB = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });

            requestDB.on('requestCompleted', function () {
                console.log('[INSERT] Request Completed: '+ requestDB.rowCount + ' Row(s) Returned');
                // console.log(ans);
                connection.close();
                resolve(ans);
            });
            connection.execSql(requestDB);
        });
    });
};
//--------------------------------------------  U P D A T E  -----------------------------------------------------------
exports.Update = function(query) {
    return new Promise(function(resolve,reject) {
        let ans;
        connection = new Connection(config);

        connection.on('connect', function(err) {
            var requestDB;
            if (err) {
                console.error('[UPDATE] Error in the connection process: ' + err.message);
                reject(err);
            }
            console.log('[UPDATE] Connection: ON');
            requestDB = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });

            requestDB.on('requestCompleted', function () {
                console.log('[UPDATE] Request Completed: '+ requestDB.rowCount + ' Row(s) Returned');
                // console.log(ans);
                connection.close();
                resolve(ans);
            });

            connection.execSql(requestDB);
        });
    });
};
//--------------------------------------------  D E L E T E  -----------------------------------------------------------
exports.Delete = function(query) {
    return new Promise(function(resolve,reject) {
        let ans;
        connection = new Connection(config);

        connection.on('connect', function(err) {
            let requestDB;
            if (err) {
                console.error('[DELETE] Error in the connection process: ' + err.message);
                reject(err);
            }
            console.log('[DELETE] Connection: ON');
            requestDB = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });

            requestDB.on('requestCompleted', function () {
                console.log('[DELETE] Request Completed: '+ requestDB.rowCount + ' Row(s) Returned');
                // console.log(ans);
                connection.close();
                resolve(ans);

            });
            connection.execSql(requestDB);
        });
    });
};
//----------------------------------------------------------------------------------------------------------------------