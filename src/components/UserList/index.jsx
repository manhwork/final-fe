import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";
import { useAuth } from "../../store/AuthContext";
import "./styles.css";

function UserList() {
    const [users, setUsers] = useState([]);
    const [userStats, setUserStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    if (!token || !user) {
        navigate("/login");
    }

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const data = await fetchModel("/api/user/list");
                setUsers(data);

                // Load stats for each user
                const stats = {};
                for (const user of data) {
                    const userStats = await fetchModel(
                        `/api/user/stats/${user._id}`
                    );
                    stats[user._id] = {
                        photoCount: userStats.photo_count,
                        commentCount: userStats.comment_count,
                    };
                }
                setUserStats(stats);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error loading users:", err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <div>
            <Typography variant="h6" sx={{ mb: 2 }}>
                List Users
            </Typography>
            <List component="nav">
                {users.map((user) => (
                    <React.Fragment key={user._id}>
                        <ListItem disablePadding>
                            <NavLink
                                to={`/users/${user._id}`}
                                style={({ isActive }) => {
                                    return {
                                        textDecoration: "none",
                                        color: "inherit",
                                        width: "100%",
                                        padding: "8px 16px",
                                        backgroundColor: isActive
                                            ? "#e3f2fd"
                                            : "transparent",
                                    };
                                }}
                            >
                                <ListItemText
                                    primary={`${user.first_name} ${user.last_name}`}
                                />
                            </NavLink>
                            <Chip
                                color="success"
                                style={{ marginRight: "10px" }}
                                label={`${
                                    userStats[user._id]?.photoCount || 0
                                } ảnh`}
                                variant="outlined"
                            />
                            <Chip
                                color="error"
                                label={`${
                                    userStats[user._id]?.commentCount || 0
                                } comment`}
                                variant="outlined"
                            />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
}

export default UserList;
