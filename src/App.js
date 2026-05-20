import { useState, useEffect } from "react";
import { I18nProvider } from "./i18n";
import AdminApp  from "./admin/AdminApp";
import ClientApp from "./client/ClientApp";

const ADMIN_PAGES = new Set([
  "dashboard","patients","queue","schedule","analytics","register",
]);

function getView() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return ADMIN_PAGES.has(hash) ? "admin" : "client";
}

function useAppRouter() {
  const [view, setView] = useState(getView);
  useEffect(() => {
    const fn = () => setView(getView());
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return view;
}

export default function App() {
  const view = useAppRouter();
  return (
    <I18nProvider>
      {view === "admin" ? <AdminApp /> : <ClientApp />}
    </I18nProvider>
  );
}
