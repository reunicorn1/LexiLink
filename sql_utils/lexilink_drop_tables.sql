-- Use this script to drop all tables in the database if needed

USE lexilink_dev_db;

-- Drop all tables if they exist
SET @tables = NULL;
SELECT GROUP_CONCAT(table_name) INTO @tables
  FROM information_schema.tables
  WHERE table_schema = 'lexilink_dev_db';

SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
PREPARE stmt FROM @tables;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
