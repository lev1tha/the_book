import { useState, useEffect } from "react";

const ROUTES = {
  "#/dashboard": "dashboard",
  "#/patients":  "patients",
  "#/queue":     "queue",
  "#/schedule":  "schedule",
  "#/analytics": "analytics",
  "#/register":  "register",
};

const getPage = () => ROUTES[window.location.hash] ?? "dashboard";

export const navigate = page => {
  window.location.hash = Object.keys(ROUTES).find(k => ROUTES[k] === page) ?? "#/dashboard";
};

export function useHashRouter() {
  const [page, setPage] = useState(getPage);
  useEffect(() => {
    const handler = () => setPage(getPage());
    window.addEventListener("hashchange", handler);
    if (!window.location.hash) window.location.hash = "#/dashboard";
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return [page, navigate];
}
