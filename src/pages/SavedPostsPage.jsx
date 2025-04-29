import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";
const GET_USER_DASHBOARD = "/api/user/dashboard";

const SavedPostsPage = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Unauthorized: No token found");
                }

                const response = await axios.get(BASE_URL + GET_USER_DASHBOARD, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.savedPosts) {
                    setSavedPosts(response.data.savedPosts);
                }
            } catch (err) {
                setError(err.message || "Failed to fetch saved posts");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Saved Posts</h1>
            <div className="grid gap-4">
                {savedPosts.length === 0 ? (
                    <p>No saved posts yet.</p>
                ) : (
                    savedPosts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-white p-4 rounded-xl shadow-md"
                        >
                            <div className="text-gray-400 text-sm mb-1">
                                Saved on {new Date(post.createdAt).toLocaleString()}
                            </div>
                            <p className="text-gray-800">{post.postContent}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SavedPostsPage;
