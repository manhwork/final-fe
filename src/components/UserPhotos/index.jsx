import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Link,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

import kenobi1 from "../../images/kenobi1.jpg";
import kenobi2 from "../../images/kenobi2.jpg";
import kenobi3 from "../../images/kenobi3.jpg";
import kenobi4 from "../../images/kenobi4.jpg";
import ludgate1 from "../../images/ludgate1.jpg";
import malcolm1 from "../../images/malcolm1.jpg";
import malcolm2 from "../../images/malcolm2.jpg";
import ouster from "../../images/ouster.jpg";
import ripley1 from "../../images/ripley1.jpg";
import ripley2 from "../../images/ripley2.jpg";
import took1 from "../../images/took1.jpg";
import took2 from "../../images/took2.jpg";
import http from "../../lib/http";

const imageMap = {
    "kenobi1.jpg": kenobi1,
    "kenobi2.jpg": kenobi2,
    "kenobi3.jpg": kenobi3,
    "kenobi4.jpg": kenobi4,
    "ludgate1.jpg": ludgate1,
    "malcolm1.jpg": malcolm1,
    "malcolm2.jpg": malcolm2,
    "ouster.jpg": ouster,
    "ripley1.jpg": ripley1,
    "ripley2.jpg": ripley2,
    "took1.jpg": took1,
    "took2.jpg": took2,
};

function UserPhotos() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState();

    const loadData = async () => {
        try {
            setLoading(true);
            const [userData, photosData] = await Promise.all([
                fetchModel(`/api/user/${userId}`),
                fetchModel(`/api/user/photosOfUser/${userId}`),
            ]);
            setUser(userData);
            setPhotos(photosData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error("Error loading data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [userId]);

    const handleAddComment = async () => {
        if (
            newComment?.comment.trim() === "" ||
            !newComment?.photo_id ||
            newComment === undefined
        ) {
            return;
        }
        const res = await http.post(
            `/api/photo/commentsOfPhoto/${newComment.photo_id}`,
            {
                comment: newComment.comment,
            }
        );

        const newCmt = {
            _id: res.data._id,
            comment: newComment.comment,
            date_time: new Date().toISOString(),
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        };

        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
                photo._id === newComment.photo_id
                    ? {
                          ...photo,
                          comments: [...(photo.comments || []), newCmt],
                      }
                    : photo
            )
        );
        setError(null);
        console.log("Comment added:", res.data);

        setNewComment({
            ...newComment,
            comment: "",
            photo_id: "",
        });
    };

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
            <Typography variant="h4" gutterBottom>
                Photos of {user.first_name} {user.last_name}
            </Typography>
            {photos.map((photo) => (
                <Paper key={photo._id} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ mb: 2 }}>
                        <img
                            src={imageMap[photo.file_name] || photo.file_name}
                            alt={`Photo by ${user.first_name}`}
                            style={{ maxWidth: "100px" }}
                        />
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        {new Date(photo.date_time).toLocaleString()}
                    </Typography>
                    {photo.comments && photo.comments.length > 0 && (
                        <List>
                            {photo.comments.map((comment) => (
                                <React.Fragment key={comment._id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Link
                                                    component={RouterLink}
                                                    to={`/users/${comment.user._id}`}
                                                    color="primary"
                                                >
                                                    {comment.user.first_name}{" "}
                                                    {comment.user.last_name}
                                                </Link>
                                            }
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                        dangerouslySetInnerHTML={{
                                                            __html: comment.comment,
                                                        }}
                                                    />
                                                    <br />
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {new Date(
                                                            comment.date_time
                                                        ).toLocaleString()}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                    <TextField
                        label="Thêm bình luận"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={
                            newComment?.photo_id === photo._id
                                ? newComment?.comment
                                : ""
                        }
                        sx={{ mt: 2 }}
                        onChange={(e) => {
                            setNewComment({
                                ...newComment,
                                comment: e.target.value,
                                photo_id: photo._id,
                            });
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddComment}
                        sx={{ mt: 2 }}
                    >
                        Gửi
                    </Button>
                </Paper>
            ))}
        </Box>
    );
}

export default UserPhotos;
