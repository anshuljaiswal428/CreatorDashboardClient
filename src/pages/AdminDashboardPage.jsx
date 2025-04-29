import React, { useEffect, useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, API_PATHS } from '../utils/apiPaths';
import { UserContext } from '../context/userContext';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useContext(UserContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${BASE_URL}${API_PATHS.ADMIN.GET_ADMIN_DASHBOARD}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          }
        );
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchDashboardData();
    }

  }, [user, userLoading]);

  if (userLoading || loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!dashboardData) {
    return <div className="p-6 text-red-600">Failed to load dashboard data.</div>;
  }

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
        <ul>
          <li><Link to="/admin/dashboard" className="block p-3 hover:bg-gray-700 rounded">Dashboard Overview</Link></li>
          <li><Link to="/admin/manage-users" className="block p-3 hover:bg-gray-700 rounded">Manage Users</Link></li>
          <li><Link to="/admin/manage-reports" className="block p-3 hover:bg-gray-700 rounded">Manage Reports</Link></li>
        </ul>
      </div>

      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

        {/* Key Stats Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium">Total Users</h3>
            <p className="text-2xl">{dashboardData.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium">Active Users</h3>
            <p className="text-2xl">{dashboardData.activeUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium">Reported Content</h3>
            <p className="text-2xl text-red-600">{dashboardData.reportedContentCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium">New Signups</h3>
            <p className="text-2xl">{dashboardData.newSignups}</p>
          </div>
        </div>

        {/* Feed Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-medium mb-4">Feed Activity</h3>
          <p>Total Feed Posts: {dashboardData.totalFeedPosts}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
