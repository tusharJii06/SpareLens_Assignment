// src/pages/Signup.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Explicitly tell Axios to send JSON
      const res = await api.post(
        "/auth/signup",
        {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setMsg("Signup successful. Token saved.");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Signup error:", err.response?.data);
      setMsg(err.response?.data?.detail || "Signup failed.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Signup</h3>
      <form onSubmit={submit}>
        <input
          placeholder="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <br />
        <input
          placeholder="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br />
        <input
          placeholder="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br />
        <button type="submit">Signup</button>
      </form>
      <div style={{ marginTop: 10, color: "green" }}>{msg}</div>
    </div>
  );
}
