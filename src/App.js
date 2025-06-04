import "./App.css";
import React from "react";
import { Grid, Paper } from "@mui/material";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useNavigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider, useAuth } from "./store/AuthContext";

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
    }

    return children;
};

const AppContent = () => {
    const token = localStorage.getItem("token");

    const { user } = useAuth();

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TopBar />
                </Grid>
                <div className="main-topbar-buffer" />
                {token && user && (
                    <Grid item sm={3}>
                        <Paper className="main-grid-item">
                            <UserList />
                        </Paper>
                    </Grid>
                )}
                <Grid item sm={token ? 9 : 12}>
                    <Paper className="main-grid-item">
                        <Routes>
                            <Route
                                path="/users/:userId"
                                element={
                                    <ProtectedRoute>
                                        <UserDetail />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/photos/:userId"
                                element={
                                    <ProtectedRoute>
                                        <UserPhotos />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/users"
                                element={
                                    <ProtectedRoute>
                                        <UserList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Navigate to={"/"} />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App;
