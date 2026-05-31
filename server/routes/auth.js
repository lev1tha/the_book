const router = require("express").Router();
const db     = require("../db");

// Телефон сравниваем по цифрам — устойчиво к пробелам, +, дефисам, неразрывным
// пробелам и прочему «мусору» из ввода/копипаста.
const digits = s => String(s || "").replace(/\D/g, "");

// Вход администратора или врача
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Введите логин и пароль" });

    const [rows] = await db.query(
      "SELECT id, role, name, department FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (rows.length === 0) return res.status(401).json({ error: "Неверный логин или пароль" });

    const user = rows[0];
    res.json({ ok: true, role: user.role, name: user.name, department: user.department, id: user.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Вход пациента по ИИН + телефон
router.post("/patient", async (req, res) => {
  try {
    const { iin, phone } = req.body;
    if (!iin || !phone) return res.status(400).json({ error: "Введите ИИН и телефон" });

    const iinClean = String(iin).trim();
    const [all] = await db.query(
      "SELECT * FROM patients WHERE TRIM(iin) = ? ORDER BY appointmentDate DESC",
      [iinClean]
    );
    const rows = all.filter(r => digits(r.phone) === digits(phone));
    if (rows.length === 0) return res.status(401).json({ error: "Запись с таким ИИН и телефоном не найдена" });

    const p = rows[0];
    res.json({
      ok: true,
      role: "patient",
      name: `${p.lastName} ${p.firstName} ${p.middleName}`.trim(),
      iin: iinClean,
      phone: p.phone,
      appointments: rows,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Получить записи пациента (после входа)
router.get("/my-appointments", async (req, res) => {
  try {
    const { iin, phone } = req.query;
    const [all] = await db.query(
      "SELECT * FROM patients WHERE TRIM(iin) = ? ORDER BY appointmentDate DESC",
      [String(iin || "").trim()]
    );
    res.json(all.filter(r => digits(r.phone) === digits(phone)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
