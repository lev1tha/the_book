const router  = require("express").Router();
const db      = require("../db");

// GET все пациенты
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM patients ORDER BY createdAt DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST зарегистрировать пациента
router.post("/", async (req, res) => {
  try {
    const p = req.body;
    await db.query(
      `INSERT INTO patients
        (id, lastName, firstName, middleName, birthDate, gender, phone, email,
         address, iin, department, doctor, appointmentDate, appointmentTime,
         complaint, status, queueNum, source)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        p.id, p.lastName, p.firstName, p.middleName || "",
        p.birthDate || null, p.gender || "unknown",
        p.phone || "", p.email || "", p.address || "", p.iin || "",
        p.department || "", p.doctor || "",
        p.appointmentDate || null, p.appointmentTime || "",
        p.complaint || "", p.status || "confirmed",
        p.queueNum || 0, p.source || "admin",
      ]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT обновить статус (и другие поля)
router.put("/:id", async (req, res) => {
  try {
    const { status, ...rest } = req.body;
    if (status) {
      await db.query("UPDATE patients SET status = ? WHERE id = ?", [status, req.params.id]);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE удалить пациента
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM patients WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
