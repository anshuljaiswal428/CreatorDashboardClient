import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast

const ManageReport = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Unauthorized: No token found");
            }

            const response = await axios.get(`${BASE_URL}${API_PATHS.ADMIN.GET_ALL_REPORTS}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.reports) {
                setReports(response.data.reports);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch reported posts");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reportId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(BASE_URL + API_PATHS.FEED.FEED_REPORT_DELETE(reportId), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReports((prev) => prev.filter((report) => report._id !== reportId));
            
            // Show success toast notification
            toast.success("Report deleted successfully!");
        } catch (err) {
            // Show error toast notification
            toast.error("Failed to delete report.", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Manage Reported Posts</h1>
            <div className="grid gap-4">
                {reports.length === 0 ? (
                    <p>No reported posts.</p>
                ) : (
                    reports.map((report) => (
                        <div
                            key={report._id}
                            className="bg-white p-4 rounded-xl shadow-md"
                        >
                            <div className="text-gray-500 text-sm mb-1">
                                Platform: {report.platform} | Reported: {new Date(report.createdAt).toLocaleString()}
                            </div>
                            <p className="text-gray-800 mb-4">Reason: {report.reason}</p>
                            <button
                                onClick={() => handleDelete(report._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Delete Report
                            </button>
                        </div>
                    ))
                )}
            </div>
            <ToastContainer /> {/* Toast container where the toast messages will appear */}
        </div>
    );
};

export default ManageReport;
