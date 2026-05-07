import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import WorkspacePage from "./pages/WorkspacePage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";

const App = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const isPublicPage = !user && ["/", "/login", "/signup"].includes(location.pathname);
  const isAuthenticatedPage = Boolean(user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const copyUserId = async () => {
    if (!user?.memberId) return;
    try {
      await navigator.clipboard.writeText(user.memberId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`container ${isPublicPage || isAuthenticatedPage ? "container-fluid" : ""}`}>
      <nav className={`top-nav-shell ${isPublicPage || isAuthenticatedPage ? "top-nav-full" : ""} ${isAuthenticatedPage ? "top-nav-auth" : ""}`}>
        <div className="top-nav-inner">
          <div className="top-nav-left">
            <Link className="nav-brand" to={user ? "/dashboard" : "/"}>Taskify</Link>
            {!user && <Link className="nav-link" to="/">Home</Link>}
            {user && <Link className="nav-link" to="/dashboard">Dashboard</Link>}
            {user && <Link className="nav-link" to="/workspace">Workspace</Link>}
          </div>

          <div className="top-nav-right">
            {!user && <Link className="nav-link nav-login" to="/login">Login</Link>}
            {!user && <Link className="nav-link nav-signup" to="/signup">Signup</Link>}
            {user && <Link className="nav-link" to="/profile">Profile</Link>}
            {user && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage copied={copied} onCopyMemberId={copyUserId} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
};

export default App;
