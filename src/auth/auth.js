const KEY = "clinic_user";

export function getUser() {
  try { return JSON.parse(localStorage.getItem(KEY)); }
  catch { return null; }
}

export function setUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(KEY);
}

export function isAdmin()   { return getUser()?.role === "admin";   }
export function isDoctor()  { return getUser()?.role === "doctor";  }
export function isPatient() { return getUser()?.role === "patient"; }
