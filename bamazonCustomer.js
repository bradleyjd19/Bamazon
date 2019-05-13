const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table2");
const chalk = require("chalk");
const log = console.log;
const red = chalk.red.bold;
const blue = chalk.blue.bold;
const green = chalk.green.bold;
const yellow = chalk.yellow.bold;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "database12345",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  log(blue("Welcome to Bamazon! You are connected as ID " + connection.threadId));
  bamazon();
});

function bamazon() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
    if (err) throw err;
    const table = new Table({
      head: ["Order ID", "Product Name", "Price"]
    });
    for (let i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id, res[i].product_name, "$ " + res[i].price.toFixed(2)]
      )
    };
    log(table.toString());
    beginOrder(res);
  })
};

function beginOrder(res) {
  inquirer.prompt(
    {
      name: "orderItem",
      message: "Please enter the Order ID of the product you'd like to purchase"
    }
  ).then(function (user) {
    const item = user.orderItem;
    const result = res[(item - 1)];
    if (isNaN(item) || item < 1 || item > res.length) {
      log(red("Please enter a valid Order ID"));
      beginOrder(res);
    } else {
      log(blue("You selected " + result.product_name));
      inquirerQuant(user);
      function inquirerQuant(user) {
      inquirer.prompt(
        {
          name: "orderQuant",
          message: "Please enter a quantity"
        }
      ).then(function (user) {
        const quant = user.orderQuant;
        if (isNaN(quant) || quant < 1) {
          log(red("Please enter a valid quantity"));
          inquirerQuant();
        } else {
          log(blue("You selected " + quant));
          if (quant > result.stock_quantity) {            
            log("Sorry, insufficient quantity to fulfill this request, " + red(result.stock_quantity) + " currently in stock");
          } else {
            log(green("Items are in stock and ready for shipment!"));
            let updateInv = "UPDATE products SET stock_quantity = ? WHERE item_id = ?"
            let data = [(result.stock_quantity - quant), item];
            connection.query(updateInv, data, function (err) {
              if (err) throw err;
              log("Inventory has been updated!");
              log("Your total for this transaction will be " + yellow("$") + yellow((quant * result.price).toFixed(2)));
              inquirer.prompt(
                {
                  type: "confirm",
                  name: "restart",
                  message: "Would you like to purchase any more products?"
                }
              ).then(function (user) {
                if (!user.restart) {
                  log("Thank you for shopping with Bamazon! See you next time!")
                  connection.end();
                } else {
                  bamazon();
                }
              })
            });
          }
        }
      })
    }
  }
  })
}