const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:              process.env.DB_HOST || "localhost",
  user:              process.env.DB_USER || "root",
  password:          process.env.DB_PASS || "",
  database:          process.env.DB_NAME || "ktp_clinic",
  waitForConnections: true,
  connectionLimit:   10,
  charset:           "UTF8MB4_UNICODE_CI",
  timezone:          "+00:00",
});

module.exports = pool;
