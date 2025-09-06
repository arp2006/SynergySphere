-- db init for user id
DROP TABLE users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    name VARCHAR(50)
);

INSERT INTO users (username, password, email, name)
VALUES ('hhh','niga123','hackr@gmail.com','niga');
