-- Создать базу данных
CREATE DATABASE IF NOT EXISTS ktp_clinic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ktp_clinic;

-- Таблица пациентов (все записи: из админки + онлайн)
CREATE TABLE IF NOT EXISTS patients (
  id              VARCHAR(64)  PRIMARY KEY,
  lastName        VARCHAR(100) NOT NULL,
  firstName       VARCHAR(100) NOT NULL,
  middleName      VARCHAR(100) DEFAULT '',
  birthDate       DATE         DEFAULT NULL,
  gender          ENUM('male','female','unknown') DEFAULT 'unknown',
  phone           VARCHAR(30)  DEFAULT '',
  email           VARCHAR(100) DEFAULT '',
  address         TEXT,
  iin             VARCHAR(20)  DEFAULT '',
  department      VARCHAR(100) DEFAULT '',
  doctor          VARCHAR(100) DEFAULT '',
  appointmentDate DATE         DEFAULT NULL,
  appointmentTime VARCHAR(10)  DEFAULT '',
  complaint       TEXT,
  status          VARCHAR(30)  DEFAULT 'confirmed',
  queueNum        INT          DEFAULT 0,
  source          VARCHAR(20)  DEFAULT 'admin',
  createdAt       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица онлайн-заявок с сайта
CREATE TABLE IF NOT EXISTS bookings (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  lastName        VARCHAR(100),
  firstName       VARCHAR(100),
  middleName      VARCHAR(100) DEFAULT '',
  phone           VARCHAR(30),
  email           VARCHAR(100) DEFAULT '',
  department      VARCHAR(100),
  doctor          VARCHAR(100),
  appointmentDate DATE         DEFAULT NULL,
  appointmentTime VARCHAR(10),
  complaint       TEXT,
  status          VARCHAR(30)  DEFAULT 'confirmed',
  source          VARCHAR(20)  DEFAULT 'online',
  createdAt       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
