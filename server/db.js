const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:               process.env.DB_HOST || "localhost",
  port:               Number(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER || "root",
  password:           process.env.DB_PASS || "",
  database:           process.env.DB_NAME || "ktp_clinic",
  waitForConnections: true,
  connectionLimit:    10,
  decimalNumbers:     true,
  multipleStatements: false,
});

// SET NAMES utf8mb4 на каждом новом соединении
const originalGetConnection = pool.getConnection.bind(pool);
pool.getConnection = async function () {
  const conn = await originalGetConnection();
  await conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
  return conn;
};

// Проверка подключения при старте
pool.query("SELECT 1")
  .then(() => console.log("✅ MySQL подключён к ktp_clinic"))
  .catch(err => console.error("❌ MySQL ошибка:", err.message));

module.exports = pool;
