import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_PATHS = {
    FEED: {
        GET_FEED: "/api/feed",
        FEED_SAVE_UPDATE: "/api/feed/save",
        FEED_REPORT_UPDATE: "/api/feed/report",
    },
};

const FeedPage = () => {
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportModal, setReportModal] = useState({ open: false, post: null });
    const [reportReason, setReportReason] = useState("");

    const fetchFeeds = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}${API_PATHS.FEED.GET_FEED}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) setFeeds(data.feeds);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeds();
    }, []);

    const savePost = async (id, platform, content) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${BASE_URL}${API_PATHS.FEED.FEED_SAVE_UPDATE}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: id, platform, content }),
            });
            const data = await response.json();
            toast.success(`${data.message}: ${data.savedPost.content}`);
        } catch (error) {
            toast.error("Error saving post");
        }
    };

    const submitReport = async () => {
        const token = localStorage.getItem("token");
        const { postId, platform } = reportModal.post;

        try {
            await fetch(`${BASE_URL}${API_PATHS.FEED.FEED_REPORT_UPDATE}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, platform, reason: reportReason }),
            });
            toast.success("Reported successfully");
            setReportModal({ open: false, post: null });
            setReportReason("");
        } catch (err) {
            toast.error("Failed to report post");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="feed-container">
            <h1 className="text-3xl font-bold mb-4">Feed</h1>
            {feeds.map((feed) => (
                <div key={feed.id} className="feed-card bg-white p-4 rounded-xl shadow mb-4">
                    <div className="text-sm text-gray-500 mb-2">{feed.platform}</div>
                    <p>{feed.content}</p>
                    <div className="flex gap-2 mt-4">
                        <button onClick={() => savePost(feed.id, feed.platform, feed.content)} className="bg-blue-600 text-white px-4 py-2 rounded-xl">Save</button>
                        <button onClick={() => setReportModal({ open: true, post: { postId: feed.id, platform: feed.platform } })} className="bg-red-600 text-white px-4 py-2 rounded-xl">Report</button>
                    </div>
                </div>
            ))}

            {reportModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Report Post</h2>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter reason..."
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={() => setReportModal({ open: false, post: null })} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={submitReport} className="px-4 py-2 bg-red-600 text-white rounded">Submit</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default FeedPage;
