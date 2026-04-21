import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    localStorage.setItem("auth_user", JSON.stringify({ email }));
    navigate("/dashboard");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="16" fill="#2563eb" />
              <text x="50" y="72" fontSize="64" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold">+</text>
            </svg>
          </div>
          <h1>Hospital Referral System</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="doctor@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-full">
            Sign in
          </button>
        </form>

        <p className="login-note">
          Demo credentials: any email + any password
        </p>
      </div>
    </div>
  );
}
