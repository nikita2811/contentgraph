import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input";
import { authApi } from "../../api/axiosInstance";
import toast from "react-hot-toast";



const ResendVerification: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);




    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!email) {
            toast.error("Email is required")
            setError("Email is required");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        try {
            authApi.post('auth/resend-verify-email', {
                'email': email
            })
            toast.success("Verification email sent successfully");
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                "Something went wrong";

            setError(message);
            toast.error(message)
        } finally {
            setLoading(false);
        }



        setSent(true);
        setCooldown(60);
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        try {
            authApi.post('auth/resend-verify-email', {
                'email': email
            })
            toast.success("Verification email sent successfully");
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                "Something went wrong";

            setError(message);


        } finally {
            setLoading(false);
        }

        setCooldown(60);
    };

    return (
        <div className="card">
            <button className="back-btn" onClick={() => navigate("/signin")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                Back to sign in
            </button>
            <div className="card-header">
                <div className="card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <h1 className="card-title">Verify your email</h1>
                <p className="card-sub">
                    {sent ? `A new verification link was sent to ${email}` : "Enter your email to resend the verification link"}
                </p>
            </div>

            {!sent ? (
                <form onSubmit={handleSubmit} noValidate>
                    <Input label="Email address" type="email" placeholder="you@example.com" value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }} error={error}
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>} />
                    <button type="submit" className={`btn btn--primary btn--full${loading ? " btn--loading" : ""}`} disabled={loading}>
                        {loading ? <span className="spinner" /> : "Send verification email"}
                    </button>
                </form>
            ) : (
                <div>
                    <div className="info-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>Check your spam folder if you don't see the email in a few minutes.</span>
                    </div>
                    <button className={`btn btn--ghost btn--full${loading ? " btn--loading" : ""}`}
                        onClick={handleResend} disabled={cooldown > 0 || loading}>
                        {loading ? <span className="spinner" style={{ borderTopColor: "#1a1a2e", borderColor: "rgba(0,0,0,0.1)" }} /> : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
                    </button>
                    <button className="btn btn--link btn--full" style={{ marginTop: "0.5rem" }} onClick={() => navigate("/login")}>
                        Back to sign in
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResendVerification;