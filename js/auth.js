const API_BASE = "https://d3cee318-5d7c-4726-97af-c099edb45e88-00-2ngmi4bbtovbk.janeway.replit.dev/api";

const Auth = {
  getToken() { return localStorage.getItem("lxx_token"); },
  setToken(t) { localStorage.setItem("lxx_token", t); },
  removeToken() { localStorage.removeItem("lxx_token"); },
  getUser() {
    const u = localStorage.getItem("lxx_user");
    return u ? JSON.parse(u) : null;
  },
  setUser(u) { localStorage.setItem("lxx_user", JSON.stringify(u)); },
  removeUser() { localStorage.removeItem("lxx_user"); },
  isLoggedIn() { return !!this.getToken(); },

  logout() {
    this.removeToken();
    this.removeUser();
    window.location.href = "login.html";
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  },

  redirectIfAuthed() {
    if (this.isLoggedIn()) {
      window.location.href = "dashboard.html";
    }
  },

  async signup(email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async fetchMe() {
    const token = this.getToken();
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) { this.logout(); return null; }
    const data = await res.json();
    this.setUser(data);
    return data;
  },
};

window.Auth = Auth;
