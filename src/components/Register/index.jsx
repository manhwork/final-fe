import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useForm } from "react-hook-form";

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { register: registerUser, user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (token && user) {
        navigate("/");
    }

    const onSubmit = async (data) => {
        if (data.password !== data.cfpassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp");
            return;
        }
        try {
            await registerUser(data);
            navigate("/");
            alert("Đăng ký thành công! ");
        } catch (error) {
            console.error("Error registering:", error);
            alert("Đăng ký không thành công. Vui lòng thử lại.");
        }
    };

    return (
        <>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Đăng ký
            </Typography>
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tên đăng nhập"
                            name="login_name"
                            sx={{ width: "100%" }}
                            {...register("login_name", { required: true })}
                        />
                        {errors.login_name && (
                            <Typography color="error" variant="body2">
                                Tên đăng nhập là bắt buộc
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mật khẩu"
                            name="password"
                            sx={{ width: "100%" }}
                            type="password"
                            {...register("password", { required: true })}
                        />
                        {errors.password && (
                            <Typography color="error" variant="body2">
                                Mật khẩu là bắt buộc
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Xác nhận mật khẩu"
                            name="cfpassword"
                            sx={{ width: "100%" }}
                            type="password"
                            {...register("cfpassword", { required: true })}
                        />
                        {errors.cfpassword && (
                            <Typography color="error" variant="body2">
                                Xác nhận mật khẩu là bắt buộc
                            </Typography>
                        )}
                        {errors.cfpassword &&
                            errors.password &&
                            errors.cfpassword !== errors.password && (
                                <Typography color="error" variant="body2">
                                    Xác nhận mật khẩu không khớp
                                </Typography>
                            )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Họ"
                            name="first_name"
                            sx={{ width: "100%" }}
                            {...register("first_name", { required: true })}
                        />
                        {errors.first_name && (
                            <Typography color="error" variant="body2">
                                Họ là bắt buộc
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tên"
                            name="last_name"
                            sx={{ width: "100%" }}
                            {...register("last_name", { required: true })}
                        />
                        {errors.last_name && (
                            <Typography color="error" variant="body2">
                                Tên là bắt buộc
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Quê quán"
                            name="location"
                            sx={{ width: "100%" }}
                            {...register("location")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mô tả"
                            name="description"
                            sx={{ width: "100%" }}
                            {...register("description")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nghề nghiệp"
                            name="occupation"
                            sx={{ width: "100%" }}
                            {...register("occupation")}
                        />
                    </Grid>
                </Grid>
                <Button
                    style={{ width: "30%" }}
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Đăng kí
                </Button>
                <Typography
                    variant="body2"
                    sx={{ cursor: "pointer", color: "blue" }}
                    onClick={() => navigate("/login")}
                >
                    Bạn đã có tài khoản? Đăng nhập
                </Typography>
            </form>
        </>
    );
}
