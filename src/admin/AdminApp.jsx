import { useState, useEffect } from "react";
import { db, isConfigured } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useHashRouter } from "../hooks/useRouter";
import { usePersistedState } from "../hooks/useLocalStorage";
import { MOCK_PATIENTS, INIT_NOTIFS } from "../constants/clinic";
import "./admin.css";

import Sidebar     from "./components/Sidebar";
import Topbar      from "./components/Topbar";
import GlobalSearch from "./components/GlobalSearch";
import NotifPanel  from "./components/NotifPanel";

import DashboardPage from "./pages/DashboardPage";
import PatientsPage  from "./pages/PatientsPage";
import QueuePage     from "./pages/QueuePage";
import SchedulePage  from "./pages/SchedulePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RegisterPage  from "./pages/RegisterPage";

export default function AdminApp() {
  const [page, navigate]   = useHashRouter();
  const [patients, setPatients] = usePersistedState("clinic_patients", MOCK_PATIENTS);
  const [notifs, setNotifs]     = usePersistedState("clinic_notifs",   INIT_NOTIFS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [initForm,   setInitForm]   = useState(null);

  // Firebase real-time sync
  useEffect(() => {
    if (!isConfigured || !db) return;
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    return onSnapshot(q, snap => {
      snap.docChanges().forEach(change => {
        if (change.type !== "added") return;
        const d = change.doc.data();
        const id = "fb_" + change.doc.id;
        setPatients(prev => {
          if (prev.some(p => p.id === id)) return prev;
          const newPt = { ...d, id, gender: d.gender || "unknown", iin: d.iin || "", address: d.address || "", queueNum: 0 };
          setNotifs(n => [{ id: Date.now(), type: "booking", msg: `Онлайн запись: ${d.lastName} ${d.firstName} — ${d.department}`, time: "только что", read: false }, ...n]);
          return [newPt, ...prev];
        });
      });
    });
  }, []);

  const handleRegister = pt => {
    setPatients(p => [pt, ...p]);
    setNotifs(n => [{ id: Date.now(), type: "register", msg: `Зарегистрирован: ${pt.lastName} ${pt.firstName}`, time: "только что", read: false }, ...n]);
  };

  const handleDelete       = id  => setPatients(p => p.filter(x => x.id !== id));
  const handleStatusChange = (id, s) => setPatients(p => p.map(x => x.id === id ? { ...x, status: s } : x));
  const handleUpdate       = upd => setPatients(p => p.map(x => x.id === upd.id ? upd : x));
  const markRead           = ()  => setNotifs(n => n.map(x => ({ ...x, read: true })));

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
    switch (page) {
      case "dashboard":  return <DashboardPage {...pageProps} />;
      case "patients":   return <PatientsPage  {...pageProps} />;
      case "queue":      return <QueuePage     patients={patients} onStatusChange={handleStatusChange} />;
      case "schedule":   return <SchedulePage  patients={patients} onSelect={p => { navigate("patients"); }} onAdd={openRegisterWithForm} />;
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
