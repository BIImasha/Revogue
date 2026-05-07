import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./login.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/login", { email, password });
      localStorage.setItem("revogueUser", JSON.stringify(response.data));
      window.dispatchEvent(new Event("storage"));
      navigate(redirectTo);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "The email or password you entered is incorrect."
      );
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">

        {/* ── LEFT DECORATIVE PANEL ── */}
        <div className="login-panel-left">
          <div className="panel-grid-lines" />
          <span className="panel-monogram">Revogue</span>

          <div className="panel-quote">
           
            <p className="panel-quote-text">
              "Fashion is the armour to survive the reality of everyday life."
            </p>
            <span className="panel-quote-attr">— Bill Cunningham</span>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="login-panel-right">
          <div className="login-card">

            <h2>Welcome <span>Back</span></h2>
            <p className="login-subtitle">
              Continue your sustainable fashion journey
            </p>
            <div className="login-divider" />

            {error && (
              <div className="login-error">⚠ {error}</div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="form-field">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-field">
                <label htmlFor="login-password">Password</label>
                <div className="password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button type="submit" className="login-bt" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In"}
              </button>

            </form>

            <p className="login-footer-text">
              New to Revogue?&nbsp;<Link to="/signup">Create an account</Link>
            </p>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Login;