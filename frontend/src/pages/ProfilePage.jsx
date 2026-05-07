import { useAuth } from "../context/AuthContext";

const ProfilePage = ({ copied, onCopyMemberId }) => {
  const { user } = useAuth();

  if (!user) return null;
  const initials = (user.name || "U")
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="profile-shell">
      <div className="card profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <h2>Profile</h2>
            <p className="profile-subtitle">Account information and identity details</p>
          </div>
        </div>
        <div className="profile-row"><span>Name</span><strong>{user.name}</strong></div>
        <div className="profile-row"><span>Email</span><strong>{user.email}</strong></div>
        <div className="profile-row">
          <span>Member ID</span>
          <div className="profile-id-actions">
            <code className="id-code">{user.memberId || "----"}</code>
            <button type="button" className="copy-id-btn" onClick={onCopyMemberId}>
              {copied ? "Copied" : "Copy Member ID"}
            </button>
          </div>
        </div>
        <div className="profile-row"><span>Role</span><span className={`role-tag ${user.role === "Admin" ? "role-admin" : "role-member"}`}>{user.role}</span></div>
      </div>
    </div>
  );
};

export default ProfilePage;
