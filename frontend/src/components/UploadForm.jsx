// src/components/UploadForm.jsx
import React, { useState } from "react";
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import api from "../services/api";

export default function UploadForm({ onUploaded }) {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const submit = async (e) => {
        e.preventDefault();
        if (!file) return setMsg("Select a file");
        const form = new FormData();
        form.append("file", file);
        form.append("name", name || file.name);
        try {
            const res = await api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
            setMsg("Uploaded");
            onUploaded();
        } catch (err) {
            setMsg(err.response?.data?.detail || "Upload error");
        }
    };
    return (
        <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Upload New Dataset</Typography>
            <TextField
                label="Dataset name"
                variant="outlined"
                value={name}
                onChange={e => setName(e.target.value)}
                size="small"
            />
            <Button
                variant="outlined"
                component="label" 
            >
                {file ? file.name : "Choose File"}
                <input
                    type="file"
                    accept=".csv,.xls,.xlsx,.zip"
                    hidden
                    onChange={e => setFile(e.target.files[0])}
                />
            </Button>
            <Button variant="contained" type="submit">Upload</Button>
            {msg && (
                <Alert severity={msg.includes("Error") ? "error" : "success"}>
                    {msg}
                </Alert>
            )}
        </Box>
    );
}
