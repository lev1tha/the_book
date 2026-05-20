const BASE = "http://localhost:5000/api";

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  getPatients:    ()         => request("GET",    "/patients"),
  addPatient:     (patient)  => request("POST",   "/patients", patient),
  updateStatus:   (id, status) => request("PUT",  `/patients/${id}`, { status }),
  deletePatient:  (id)       => request("DELETE", `/patients/${id}`),
  createBooking:  (booking)  => request("POST",   "/bookings", booking),
};
