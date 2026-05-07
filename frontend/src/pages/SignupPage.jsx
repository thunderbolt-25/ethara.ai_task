import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/signup", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h2>Sign Up</h2>
        <p className="auth-subtext">Create your account and start collaborating with your team.</p>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
