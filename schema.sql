-- Drops database "bamazon" if it exists
DROP DATABASE if exists bamazon;

-- Creates new database "bamazon"
CREATE DATABASE bamazon;

-- Selects "bamazon" as the recipient for subsequent commands
USE bamazon;

-- Creates table "products" with columns as designated below
CREATE TABLE products (
	item_id INT auto_increment
	, product_name VARCHAR(255) NOT null
	, department_name VARCHAR(255) NOT null
	, price DECIMAL(10, 2)
	, stock_quantity INT
	, PRIMARY KEY (item_id)
);