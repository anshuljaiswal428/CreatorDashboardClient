import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";

const UserDashboardPage = () => {
    const [creditPoints, setCreditPoints] = useState(0);
    const [savedPostsCount, setSavedPostsCount] = useState(0);
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(BASE_URL + API_PATHS.USERS.GET_USER_DASHBOARD, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const { credits, savedPosts } = res.data;
                setCreditPoints(credits);
                setSavedPostsCount(savedPosts?.length || 0);
            } catch (err) {
                toast.error("Failed to load dashboard data.");
                console.error(err);
            }
        };

        if (!loading && user) {
            fetchDashboardData();
        }
    }, [loading, user]);

    const goTo = (path) => navigate(path);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold mb-6">Welcome, {user?.name} 👋</h1>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-lg font-semibold mb-2">Credit Points</h2>
                    <p className="text-3xl text-green-600">{creditPoints}</p>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-lg font-semibold mb-2">Saved Posts</h2>
                    <p className="text-3xl text-blue-600">{savedPostsCount}</p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <button
                    onClick={() => goTo("/feed")}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 text-center"
                >
                    Go to Feed
                </button>
                <button
                    onClick={() => goTo("/user/saved-posts")}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 text-center"
                >
                    View Saved Posts
                </button>
            </div>
        </div>
    );
};

export default UserDashboardPage;
