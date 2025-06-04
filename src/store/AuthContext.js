import { createContext, useContext, useEffect, useState } from "react";
import http from "../lib/http";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchUser = async () => {
                try {
                    const response = await http.get("/api/admin/me");
                    setUser(response.data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            };
            fetchUser();
        }
    }, []);

    const login = async (loginName, password) => {
        try {
            const response = await http.post("/api/admin/login", {
                login_name: loginName,
                password: password,
            });
            setUser(response.data.user);
            console.log("Login successful:", response.data.user);
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const response = await http.post("/api/user", data);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            console.error("Error registering:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await http.post("/api/admin/logout");
            localStorage.removeItem("token");
            setUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
