-- Active: 1700213960937@@127.0.0.1@3306@test
CREATE DATABASE book_inventory_db;

SHOW DATABASES;

USE book_inventory_db;

SHOW TABLES;

CREATE TABLE owners
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL UNIQUE
)


DESC owners;

CREATE TABLE books
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    status ENUM('returned', 'not returned') NOT NULL,
    id_owner INT NOT NULL,
    FOREIGN KEY (id_owner) REFERENCES owners(id)
)

DESC books;