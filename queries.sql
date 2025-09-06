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
VALUES ('hhh','hacker1234','hackr@gmail.com','hack');

-- db for project and todo
DROP TABLE projects, todo, tasks;
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(500) NOT NULL,
  deadline DATE,
  leader VARCHAR(255),
  CONSTRAINT fk_leader FOREIGN KEY (leader) REFERENCES users(username) ON DELETE SET NULL
);
ALTER TABLE projects ADD COLUMN description TEXT;

CREATE TABLE todo (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(500) NOT NULL,
  project_id INT,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  text VARCHAR(3000) NOT NULL,
  list INT NOT NULL,
  CONSTRAINT fk_list FOREIGN KEY (list) REFERENCES todo(id) ON DELETE CASCADE
);

-- sample data
INSERT INTO users (username, password, email, name) VALUES
('alice', '$2b$10$hashedpassword', 'alice@example.com', 'Alice'),
('bob', '$2b$10$hashedpassword', 'bob@example.com', 'Bob'),
('charlie', '$2b$10$hashedpassword', 'charlie@example.com', 'Charlie');

INSERT INTO projects (topic, deadline, leader) VALUES
('Project Apollo', '2025-12-31', 'alice'),
('Project Zeus', '2026-03-15', 'bob'),
('Project Hermes', '2025-11-30', 'charlie');

INSERT INTO todo (topic, project_id) VALUES
('Frontend Development', 1),
('Backend Development', 1),
('Marketing Plan', 2),
('QA Testing', 3);

INSERT INTO tasks (text, list) VALUES
('Design landing page', 1),
('Implement login API', 2),
('Create marketing slides', 3),
('Write test cases', 4),
('Fix bug #234', 2),
('Plan launch event', 3);
