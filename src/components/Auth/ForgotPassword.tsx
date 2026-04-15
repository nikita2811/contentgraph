import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input";

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!email) { setError("Email is required"); return; }
        if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email"); return; }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setSent(true);
    };

    if (sent) return (
        <div className="card card--center">
            <div className="success-icon">📬</div>
            <h2 className="card-title">Reset link sent</h2>
            <p className="card-sub">If <strong>{email}</strong> is registered, you'll receive a reset link shortly.</p>
            <button className="btn btn--primary btn--full" onClick={() => navigate("/set-new-password")}>
                I have a reset code →
            </button>
            <button className="btn btn--link" onClick={() => navigate("/signin")}>Back to sign in</button>
        </div>
    );

    return (
        <div className="card">
            <button className="back-btn" onClick={() => navigate("/signin")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                Back to sign in
            </button>
            <div className="card-header">
                <div className="card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h1 className="card-title">Forgot password?</h1>
                <p className="card-sub">No worries. Enter your email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} noValidate>
                <Input label="Email address" type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }} error={error}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>} />
                <button type="submit" className={`btn btn--primary btn--full${loading ? " btn--loading" : ""}`} disabled={loading}>
                    {loading ? <span className="spinner" /> : "Send reset link"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;