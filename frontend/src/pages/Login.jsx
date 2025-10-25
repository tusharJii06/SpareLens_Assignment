// src/pages/Login.jsx
import React, { useState } from "react";
import { Container, Paper, Box, Typography, TextField, Button, Alert } from '@mui/material';
import api from "../services/api";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState("");
    const submit = async (e) => {
        e.preventDefault();
        try {
            const data = new URLSearchParams();
            data.append("username", form.username);
            data.append("password", form.password);
            const res = await api.post("/auth/login", data);
            const token = res.data.access_token;
            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            window.location.href = "/dashboard";
        } catch (err) {
            setMsg(err.response?.data?.detail || "Error");
        }
    };
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Log In
                </Typography>
                <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
                    <input
                        placeholder="username"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })} 
                    /><br />
                    <input
                        placeholder="password"
                        type="password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })} 
                    /><br />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    {msg && <Alert severity="error">{msg}</Alert>}
                </Box>
            </Paper>
        </Container>
    );
}
