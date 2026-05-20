const express  = require("express");
const cors     = require("cors");

const patientsRouter = require("./routes/patients");
const bookingsRouter = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/patients", patientsRouter);
app.use("/api/bookings", bookingsRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
