const mysql = require("mysql");
const inquirer = require("inquirer");
const {printTable} = require("console-table-printer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "database12345",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;
    printTable(res);
    connection.end();
  })
};