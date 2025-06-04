import {
    AppBar,
    Box,
    Button,
    Modal,
    styled,
    Toolbar,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import "./styles.css";
import http from "../../lib/http";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

function TopBar() {
    let title = "Photo Sharing App";
    const { user, logout } = useAuth();
    console.log("user", user);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem("token");

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleUpload = async (e) => {
        console.log("upload file", e.target.files);
        const formData = new FormData();
        formData.append("photo", e.target.files[0]);
        try {
            const res = await http.post("/api/photo/new", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Upload response:", res);
            navigate(`/photos/${user._id}`);
            setIsOpen(false);
            alert("Upload successful!");
        } catch (error) {
            console.error("Error uploading photo:", error);
        }
    };

    return (
        <AppBar className="topbar-appBar" position="absolute">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Link
                        to={"/"}
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        <Typography variant="h6" color="inherit">
                            Manh Nguyen App
                        </Typography>
                    </Link>
                </Box>
                <Typography variant="h6" color="inherit">
                    {title}
                </Typography>
                {token ? (
                    <>
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            Hi {user?.first_name} {user?.last_name}
                        </Typography>
                        <Button
                            sx={{ ml: 2 }}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setIsOpen(true);
                            }}
                        >
                            Add Photo
                        </Button>
                        <Button
                            sx={{ ml: 2 }}
                            color="error"
                            variant="contained"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>

                        <Modal
                            open={isOpen}
                            onClose={() => setIsOpen(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    component="h2"
                                    sx={{ mb: 2 }}
                                >
                                    Đăng ảnh
                                </Typography>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                >
                                    Upload Photo
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={handleUpload}
                                        accept="image/*"
                                        name="photo"
                                    />
                                </Button>
                            </Box>
                        </Modal>
                    </>
                ) : (
                    <></>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
