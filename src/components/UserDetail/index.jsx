import React, { useEffect, useState } from "react";
import { Typography, Box, Link, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                const userData = await fetchModel(`/api/user/${userId}`);
                setUser(userData);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error loading user:", err);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [userId]);

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

    if (!user) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="warning">User not found</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: "bold",
                }}
                gutterBottom
            >
                {user.first_name} {user.last_name}
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <List>
                    <ListItem>
                        <ListItemText primary="Location" secondary={user.location} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Occupation" secondary={user.occupation} />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Description"
                            secondary={
                                <Typography
                                    component="span"
                                    dangerouslySetInnerHTML={{
                                        __html: user.description,
                                    }}
                                />
                            }
                        />
                    </ListItem>
                </List>
            </Paper>
            <Link component={RouterLink} to={`/photos/${userId}`} variant="button" color="primary">
                View Photos Of {user.first_name} {user.last_name}
            </Link>
        </Box>
    );
}

export default UserDetail;
