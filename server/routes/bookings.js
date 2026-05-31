const router = require("express").Router();
const db     = require("../db");

// GET все онлайн-заявки
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings ORDER BY createdAt DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST новая онлайн-заявка с сайта
router.post("/", async (req, res) => {
  try {
    const b = req.body;

    // 1. Сохранить в bookings
    const [result] = await db.query(
      `INSERT INTO bookings
        (lastName, firstName, middleName, iin, phone, email,
         department, doctor, appointmentDate, appointmentTime, complaint)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        b.lastName, b.firstName, b.middleName || "",
        b.iin || "",
        b.phone, b.email || "",
        b.department, b.doctor,
        b.appointmentDate || null, b.appointmentTime,
        b.complaint || "",
      ]
    );

    // 2. Дублировать в patients чтобы админ видел
    const patientId = "online_" + result.insertId;
    await db.query(
      `INSERT INTO patients
        (id, lastName, firstName, middleName, gender, iin, phone, email,
         department, doctor, appointmentDate, appointmentTime,
         complaint, status, queueNum, source)
       VALUES (?,?,?,?,'unknown',?,?,?,?,?,?,?,?,'confirmed',0,'online')`,
      [
        patientId,
        b.lastName, b.firstName, b.middleName || "",
        b.iin || "",
        b.phone, b.email || "",
        b.department, b.doctor,
        b.appointmentDate || null, b.appointmentTime,
        b.complaint || "",
      ]
    );

    res.json({ ok: true, id: patientId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
