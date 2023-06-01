var mysql = require('mysql');


var server = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 8889,
  password: 'root',
  database: "project",
  multipleStatements: true,
});
server.connect();

module.exports = server;