-- prepares a MySQL Test DATABASE for the project

CREATE DATABASE IF NOT EXISTS lexilink_test_db;
CREATE USER IF NOT EXISTS 'lexilink_test'@'localhost' IDENTIFIED BY 'lexilink_test_pwd';
GRANT ALL PRIVILEGES ON `lexilink_test_db`.* TO 'lexilink_test'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'lexilink_test'@'localhost';
FLUSH PRIVILEGES;
