import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function Login() {
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (token && user) {
        navigate("/");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(loginName, password);
            // console.log("Logging in with:", { loginName, password });
            navigate("/");
            alert("Đăng nhập thành công!");
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };
    return (
        <>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Đăng nhập
            </Typography>
            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
                <TextField
                    label="Tên đăng nhập"
                    name="login_name"
                    sx={{ width: "50%" }}
                    onChange={(e) => setLoginName(e.target.value)}
                />
                <TextField
                    label="Mật khẩu"
                    name="password"
                    sx={{ width: "50%" }}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    style={{ width: "50%" }}
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Đăng nhập
                </Button>
                <Typography
                    variant="body2"
                    sx={{ cursor: "pointer", color: "blue" }}
                    onClick={() => navigate("/register")}
                >
                    Chưa có tài khoản? Đăng ký ngay
                </Typography>
            </form>
        </>
    );
}
