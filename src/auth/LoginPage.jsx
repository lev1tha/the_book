import { useState } from "react";
import { Heart, Stethoscope, User, Lock, Phone, AlertCircle } from "lucide-react";
import { api } from "../api";
import { setUser } from "./auth";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Golos Text',sans-serif;background:#f0f4ff;min-height:100vh;display:flex;align-items:center;justify-content:center}
.lp-wrap{width:100%;max-width:420px;padding:24px}
.lp-logo{text-align:center;margin-bottom:32px}
.lp-logo-mark{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#1e40af,#2563eb);display:flex;align-items:center;justify-content:center;margin:0 auto 12px}
.lp-logo-name{font-size:20px;font-weight:800;color:#0f172a}
.lp-logo-sub{font-size:12px;color:#64748b;margin-top:2px}
.lp-tabs{display:flex;background:#e2e8f0;border-radius:10px;padding:3px;margin-bottom:24px;gap:3px}
.lp-tab{flex:1;padding:9px;border:none;background:transparent;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Golos Text',sans-serif;color:#64748b;transition:all .15s}
.lp-tab.active{background:#fff;color:#1e40af;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.lp-card{background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.lp-title{font-size:18px;font-weight:700;color:#0f172a;margin-bottom:4px}
.lp-sub{font-size:13px;color:#64748b;margin-bottom:22px}
.lp-group{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.lp-label{font-size:12.5px;font-weight:600;color:#374151}
.lp-inp-wrap{position:relative}
.lp-inp-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none}
.lp-inp{width:100%;padding:10px 12px 10px 36px;border:1.5px solid #e2e8f0;border-radius:9px;font-size:14px;font-family:'Golos Text',sans-serif;color:#0f172a;outline:none;transition:border-color .15s}
.lp-inp:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.lp-btn{width:100%;padding:12px;background:#1e40af;color:#fff;border:none;border-radius:9px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Golos Text',sans-serif;transition:background .15s;margin-top:6px}
.lp-btn:hover{background:#1d3fad}
.lp-btn:disabled{background:#93c5fd;cursor:not-allowed}
.lp-err{display:flex;align-items:center;gap:7px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 12px;font-size:13px;color:#dc2626;margin-bottom:12px}
.lp-hint{font-size:11.5px;color:#94a3b8;text-align:center;margin-top:16px;line-height:1.5}
.lp-hint b{color:#64748b}
`;

export default function LoginPage({ onLogin }) {
  const [tab,      setTab]     = useState("staff");
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState("");
  const [staff,    setStaff]   = useState({ username: "", password: "" });
  const [patient,  setPatient] = useState({ iin: "", phone: "" });

  const changeStaff   = e => setStaff(p => ({ ...p, [e.target.name]: e.target.value }));
  const changePatient = e => setPatient(p => ({ ...p, [e.target.name]: e.target.value }));

  const loginStaff = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await api.loginStaff(staff.username, staff.password);
      setUser(user);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginPatient = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await api.loginPatient(patient.iin, patient.phone);
      setUser(user);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="lp-wrap">
        <div className="lp-logo">
          <div className="lp-logo-mark"><Heart size={26} color="#fff" fill="#fff" /></div>
          <div className="lp-logo-name">КТП Поликлиника</div>
          <div className="lp-logo-sub">Кыргыз-Түрк Поликлиникасы</div>
        </div>

        <div className="lp-tabs">
          <button className={`lp-tab${tab === "staff"   ? " active" : ""}`} onClick={() => { setTab("staff");   setError(""); }}>
            <Stethoscope size={13} style={{ marginRight: 5 }} /> Персонал
          </button>
          <button className={`lp-tab${tab === "patient" ? " active" : ""}`} onClick={() => { setTab("patient"); setError(""); }}>
            <User size={13} style={{ marginRight: 5 }} /> Пациент
          </button>
        </div>

        <div className="lp-card">
          {error && (
            <div className="lp-err"><AlertCircle size={15} /> {error}</div>
          )}

          {tab === "staff" ? (
            <form onSubmit={loginStaff}>
              <div className="lp-title">Вход для персонала</div>
              <div className="lp-sub">Администратор или врач</div>
              <div className="lp-group">
                <label className="lp-label">Логин</label>
                <div className="lp-inp-wrap">
                  <User size={14} className="lp-inp-ico" />
                  <input className="lp-inp" name="username" value={staff.username} onChange={changeStaff} placeholder="admin / kozlova" autoComplete="username" required />
                </div>
              </div>
              <div className="lp-group">
                <label className="lp-label">Пароль</label>
                <div className="lp-inp-wrap">
                  <Lock size={14} className="lp-inp-ico" />
                  <input className="lp-inp" name="password" type="password" value={staff.password} onChange={changeStaff} placeholder="••••••••" autoComplete="current-password" required />
                </div>
              </div>
              <button className="lp-btn" type="submit" disabled={loading}>
                {loading ? "Вход..." : "Войти"}
              </button>
              <div className="lp-hint">
                Демо: <b>admin / admin123</b> или <b>kozlova / doctor123</b>
              </div>
            </form>
          ) : (
            <form onSubmit={loginPatient}>
              <div className="lp-title">Личный кабинет пациента</div>
              <div className="lp-sub">Войдите по ИИН и номеру телефона</div>
              <div className="lp-group">
                <label className="lp-label">ИИН (14 цифр)</label>
                <div className="lp-inp-wrap">
                  <User size={14} className="lp-inp-ico" />
                  <input className="lp-inp" name="iin" value={patient.iin} onChange={changePatient} placeholder="85031200001234" maxLength={14} required />
                </div>
              </div>
              <div className="lp-group">
                <label className="lp-label">Телефон</label>
                <div className="lp-inp-wrap">
                  <Phone size={14} className="lp-inp-ico" />
                  <input className="lp-inp" name="phone" value={patient.phone} onChange={changePatient} placeholder="+996 700 123 456" required />
                </div>
              </div>
              <button className="lp-btn" type="submit" disabled={loading}>
                {loading ? "Поиск..." : "Найти мои записи"}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => { window.location.hash = ""; }}
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", fontFamily: "'Golos Text', sans-serif" }}
          >
            ← Вернуться на сайт
          </button>
        </div>
      </div>
    </>
  );
}
