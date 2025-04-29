import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUserManagement from "./pages/AdminUserManagement";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";
import Footer from "./components/common/Footer";
import FeedPage from "./pages/FeedPage";
import PrivateRoute from "./components/PrivateRoute";
import SavedPostsPage from "./pages/SavedPostsPage";
import ManageReport from "./pages/ManageReport";

const App = () => {
  return (
    <UserProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Router>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/manage-users" element={<AdminUserManagement />} />
              <Route path="/admin/manage-reports" element={<ManageReport />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboardPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/user/saved-posts" element={<SavedPostsPage />} />
            </Route>

            {/* Default Route */}
            {/* <Route path="/" element={<Root />} /> */}
          </Routes>
        </Router>
        <Footer /> {/* ✅ Persistent footer */}
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  return !user
    ? <Navigate to="/login" />
    : user.role === "admin"
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/user/dashboard" />;
};
