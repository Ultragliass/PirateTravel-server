CREATE DATABASE vacation DEFAULT CHARACTER SET utf8mb4;

USE vacation;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
id int NOT NULL AUTO_INCREMENT,
username varchar(20) NOT NULL,
password varchar(60) NOT NULL,
name varchar(20) NOT NULL,
lastname varchar(20) NOT NULL,
userType varchar(5) NOT NULL DEFAULT 'user',
PRIMARY KEY(id),
INDEX username(username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (username, password, name, lastname, userType) VALUES (
"Admin",
"$2b$10$zO19YZJLWE4Yqi.Hr7U8eui5CYWe4hbqgXJV07sOoCJAaGzr4zGQK",
"Israel",
"Israeli",
"admin"
);

DROP TABLE IF EXISTS vacations;

CREATE TABLE vacations (
id int NOT NULL AUTO_INCREMENT,
description varchar(200) NOT NULL,
destination varchar(30) NOT NULL,
image varchar(100) NOT NULL,
startDate datetime NOT NULL,
endDate datetime NOT NULL,
price double NOT NULL,
PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS followers;

CREATE TABLE followers (
id int NOT NULL AUTO_INCREMENT,
userId int NOT NULL,
vacationId int NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (userId) REFERENCES users (id),
FOREIGN KEY (vacationId) REFERENCES vacations (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;