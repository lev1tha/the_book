const BASE = "/api";

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  // Пациенты
  getPatients:   ()           => request("GET",    "/patients"),
  addPatient:    (pt)         => request("POST",   "/patients", pt),
  updateStatus:  (id, status) => request("PUT",    `/patients/${id}`, { status }),
  deletePatient: (id)         => request("DELETE", `/patients/${id}`),

  // Онлайн запись
  createBooking: (b)          => request("POST",   "/bookings", b),

  // Авторизация
  loginStaff:    (username, password) => request("POST", "/auth/login",   { username, password }),
  loginPatient:  (iin, phone)         => request("POST", "/auth/patient", { iin, phone }),
  getMyAppointments: (iin, phone)     => request("GET",  `/auth/my-appointments?iin=${encodeURIComponent(iin)}&phone=${encodeURIComponent(phone)}`),
};
