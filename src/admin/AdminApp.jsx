import { useState, useEffect } from "react";
import { useHashRouter } from "../hooks/useRouter";
import { usePersistedState } from "../hooks/useLocalStorage";
import { INIT_NOTIFS } from "../constants/clinic";
import { api } from "../api";
import "./admin.css";

import Sidebar      from "./components/Sidebar";
import Topbar       from "./components/Topbar";
import GlobalSearch from "./components/GlobalSearch";
import NotifPanel   from "./components/NotifPanel";

import DashboardPage from "./pages/DashboardPage";
import PatientsPage  from "./pages/PatientsPage";
import QueuePage     from "./pages/QueuePage";
import SchedulePage  from "./pages/SchedulePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RegisterPage  from "./pages/RegisterPage";

export default function AdminApp({ onLogout }) {
  const [page, navigate]    = useHashRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notifs, setNotifs]     = usePersistedState("clinic_notifs", INIT_NOTIFS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [initForm,   setInitForm]   = useState(null);

  // Загрузка пациентов из MySQL при старте
  useEffect(() => {
    api.getPatients()
      .then(data => setPatients(data))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async pt => {
    try {
      await api.addPatient(pt);
      setPatients(p => [pt, ...p]);
      setNotifs(n => [{
        id: Date.now(), type: "ok",
        title: "Новая запись",
        body: `${pt.lastName} ${pt.firstName} — ${pt.department}`,
        time: "только что", read: false,
      }, ...n]);
    } catch (e) {
      alert("Ошибка сохранения: " + e.message);
    }
  };

  const handleDelete = async id => {
    try {
      await api.deletePatient(id);
      setPatients(p => p.filter(x => x.id !== id));
    } catch (e) {
      alert("Ошибка удаления: " + e.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateStatus(id, status);
      setPatients(p => p.map(x => x.id === id ? { ...x, status } : x));
    } catch (e) {
      alert("Ошибка обновления: " + e.message);
    }
  };

  const handleUpdate = upd => setPatients(p => p.map(x => x.id === upd.id ? upd : x));
  const markRead     = ()  => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const openRegisterWithForm = (dept, doc, date, time) => {
    setInitForm({ department: dept, doctor: doc, appointmentDate: date, appointmentTime: time });
    navigate("register");
  };

  const unread = notifs.filter(n => !n.read).length;

  const pageProps = {
    patients,
    onStatusChange: handleStatusChange,
    onDelete: handleDelete,
    onUpdate: handleUpdate,
    go: navigate,
  };

  const renderPage = () => {
    if (loading) return <div style={{ padding: 40, color: "var(--muted)", fontSize: 14 }}>Загрузка...</div>;
    switch (page) {
      case "dashboard":  return <DashboardPage {...pageProps} />;
      case "patients":   return <PatientsPage  {...pageProps} />;
      case "queue":      return <QueuePage     patients={patients} onStatusChange={handleStatusChange} />;
      case "schedule":   return <SchedulePage  patients={patients} onSelect={() => navigate("patients")} onAdd={openRegisterWithForm} />;
      case "analytics":  return <AnalyticsPage patients={patients} />;
      case "register":   return (
        <RegisterPage
          patients={patients}
          onRegister={handleRegister}
          initForm={initForm}
          onInitUsed={() => setInitForm(null)}
        />
      );
      default: return <DashboardPage {...pageProps} />;
    }
  };

  return (
    <>
      <div className="layout">
        <Sidebar page={page} go={navigate} patients={patients} />
        <div className="main">
          <Topbar
            page={page}
            go={navigate}
            notifCount={unread}
            onNotif={() => setNotifOpen(v => !v)}
            onSearch={() => setSearchOpen(true)}
            onLogout={onLogout}
          />
          {notifOpen && (
            <NotifPanel
              notifs={notifs}
              onMarkAll={() => { markRead(); setNotifOpen(false); }}
            />
          )}
          <div className="page">
            {renderPage()}
          </div>
        </div>
      </div>
      {searchOpen && (
        <GlobalSearch patients={patients} onClose={() => setSearchOpen(false)} navigate={navigate} />
      )}
    </>
  );
}
