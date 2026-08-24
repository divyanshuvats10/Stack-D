import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { setCredentials } from "../features/auth/authSlice";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      dispatch(setCredentials(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel auth-intro">
        <span className="auth-stamp">STACK'D / 02</span>
        <div>
          <p className="auth-kicker">// make it yours</p>
          <h1>Your table<br /><span>is waiting.</span></h1>
          <p className="auth-copy">Create an account to save your favorites, build bold combinations, and keep every order moving.</p>
        </div>
        <p className="auth-note">BUILD. BITE. REPEAT.</p>
      </section>
      <section className="auth-panel auth-form-panel">
        <div className="auth-heading"><p className="auth-kicker">Create account</p><h2>Join the table.</h2><p>It takes less than a minute to get started.</p></div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="signup-name">Name</label>
          <input id="signup-name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email address</label>
          <input id="signup-email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
      </section>
    </main>
  );
};

export default Signup;