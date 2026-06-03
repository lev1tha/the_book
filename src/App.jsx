import { useState, useEffect } from "react";
import { I18nProvider } from "./i18n";
import AdminApp   from "./admin/AdminApp";
import ClientApp  from "./client/ClientApp";
import DoctorApp  from "./doctor/DoctorApp";
import PatientApp from "./patient/PatientApp";
import LoginPage  from "./auth/LoginPage";
import { getUser, clearUser } from "./auth/auth";

const ADMIN_PAGES  = new Set(["dashboard","patients","queue","schedule","analytics","register"]);
const DOCTOR_PAGES = new Set(["doctor"]);
const PORTAL_PAGES = new Set(["portal"]);

function getHash() {
  return window.location.hash.replace(/^#\/?/, "").split("?")[0];
}

function getView(user) {
  const hash = getHash();

  if (hash === "login") return "login";

  if (ADMIN_PAGES.has(hash)) {
    if (!user)               { window.location.hash = "login"; return "login"; }
    if (user.role !== "admin") { window.location.hash = "login"; return "login"; }
    return "admin";
  }

  if (DOCTOR_PAGES.has(hash)) {
    if (!user)                { window.location.hash = "login"; return "login"; }
    if (user.role !== "doctor") { window.location.hash = "login"; return "login"; }
    return "doctor";
  }

  if (PORTAL_PAGES.has(hash)) {
    if (!user)                 { window.location.hash = "login"; return "login"; }
    if (user.role !== "patient") { window.location.hash = "login"; return "login"; }
    return "portal";
  }

  return "client";
}

export default function App() {
  const [user, setUser] = useState(() => getUser());
  const [view, setView] = useState(() => getView(getUser()));

  useEffect(() => {
    const update = () => {
      const u = getUser();
      setUser(u);
      setView(getView(u));
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    if (u.role === "admin")   window.location.hash = "dashboard";
    else if (u.role === "doctor")  window.location.hash = "doctor";
    else if (u.role === "patient") window.location.hash = "portal";
    else window.location.hash = "";
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
    window.location.hash = "";
  };

  return (
    <I18nProvider>
      {view === "login"   && <LoginPage onLogin={handleLogin} />}
      {view === "admin"   && <AdminApp  onLogout={handleLogout} />}
      {view === "doctor"  && <DoctorApp onLogout={handleLogout} />}
      {view === "portal"  && <PatientApp onLogout={handleLogout} />}
      {view === "client"  && <ClientApp />}
    </I18nProvider>
  );
}
