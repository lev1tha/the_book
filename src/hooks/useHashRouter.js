import { useState, useEffect } from "react";

const ROUTES = {
  "#/dashboard": "dashboard",
  "#/patients":  "patients",
  "#/queue":     "queue",
  "#/register":  "register",
};

function getPage() {
  return ROUTES[window.location.hash] ?? "dashboard";
}

export function navigate(page) {
  const hash = Object.keys(ROUTES).find((k) => ROUTES[k] === page) ?? "#/dashboard";
  window.location.hash = hash;
}

export function useHashRouter() {
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onHash = () => setPage(getPage());
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "#/dashboard";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return [page, navigate];
}
