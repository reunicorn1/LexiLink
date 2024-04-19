-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS lexilink_dev_db;
CREATE USER IF NOT EXISTS 'lexilink_dev'@'localhost' IDENTIFIED BY 'lexilink_dev_pwd';
GRANT ALL PRIVILEGES ON `lexilink_dev_db`.* TO 'lexilink_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'lexilink_dev'@'localhost';
FLUSH PRIVILEGES;
