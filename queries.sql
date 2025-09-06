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
VALUES ('hhh','hacker1234','hackr@gmail.com','niga');

-- db for project and todo
DROP TABLE projects, todo, tasks;
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(500),
  deadline DATE,
  leader VARCHAR(255),
  CONSTRAINT fk_leader FOREIGN KEY (leader) REFERENCES users(username)
);

CREATE TABLE todo (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(500)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  text VARCHAR(3000),
  list INT,
  CONSTRAINT fk_list FOREIGN KEY (list) REFERENCES todo(id)
);
