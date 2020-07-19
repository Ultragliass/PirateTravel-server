CREATE DATABASE vacation DEFAULT CHARSET utf8mb4;

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
"Admin",
"Admin",
"admin"
);

DROP TABLE IF EXISTS vacations;

CREATE TABLE vacations (
id int NOT NULL AUTO_INCREMENT,
destination varchar(30) NOT NULL,
description varchar(200) NOT NULL,
image varchar(200) NOT NULL,
startDate datetime NOT NULL,
endDate datetime NOT NULL,
price double NOT NULL,
followers int NOT NULL DEFAULT 0,
PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO vacations (destination, description, image, startDate, endDate, price) VALUES 
("Jerusalem",
 "A historical journy though one of the most important cities in the world, rich in culture like no other.",
 "https://img.wallpapersafari.com/desktop/1920/1080/4/4/eDjEWF.jpeg",
 "2020-10-10",
 "2020-10-11",
 "350"),
 ("Portugal",
 "If romance is what you seek, look no further. Leave the kids at home, this one's for you and your special one.",
 "https://wallpapercave.com/wp/wp2028756.jpg",
 "2020-11-10",
 "2020-11-11",
 "500"),
  ("Las Vegas",
 "Bachelor/ette party? Crazy wedding? Just wanna blow some cash? What happens in Vegas, stays in Vegas, we won't tell.",
 "https://wallpaperplay.com/walls/full/2/f/2/297583.jpg",
 "2020-12-10",
 "2020-12-11",
 "500");


DROP TABLE IF EXISTS followers;

CREATE TABLE followers (
id int NOT NULL AUTO_INCREMENT,
userId int NOT NULL,
vacationId int NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (userId) REFERENCES users (id),
FOREIGN KEY (vacationId) REFERENCES vacations (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
id int NOT NULL AUTO_INCREMENT,
userId int NOT NULL,
vacationId int NOT NULL,
username varchar(20) NOT NULL,
comment varchar(100) NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (userId) references users (id),
FOREIGN KEY (vacationId) references vacations (id),
FOREIGN KEY (username) references users (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;