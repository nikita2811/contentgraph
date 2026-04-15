import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input";

const SetNewPassword: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: "", confirm: "" });
    const [errors, setErrors] = useState<Partial<typeof form>>({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [key]: e.target.value }));
        setErrors((p) => ({ ...p, [key]: "" }));
    };

    const rules = [
        { label: "At least 8 characters", ok: form.password.length >= 8 },
        { label: "One uppercase letter", ok: /[A-Z]/.test(form.password) },
        { label: "One number", ok: /[0-9]/.test(form.password) },
        { label: "One special character", ok: /[^A-Za-z0-9]/.test(form.password) },
    ];

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        const e: Partial<typeof form> = {};
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8) e.password = "At least 8 characters";
        if (!form.confirm) e.confirm = "Please confirm your password";
        else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setDone(true);
    };

    if (done) return (
        <div className="card card--center">
            <div className="success-icon">✓</div>
            <h2 className="card-title">Password updated!</h2>
            <p className="card-sub">Your password has been reset successfully.</p>
            <button className="btn btn--primary btn--full" onClick={() => navigate("/login")}>
                Sign in with new password
            </button>
        </div>
    );

    return (
        <div className="card">
            <button className="back-btn" onClick={() => navigate("/forgot-password")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                Back
            </button>
            <div className="card-header">
                <div className="card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <h1 className="card-title">Set new password</h1>
                <p className="card-sub">Choose a strong password for your account.</p>
            </div>
            <form onSubmit={handleSubmit} noValidate>
                <Input label="New password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set("password")} error={errors.password}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>} />

                {form.password && (
                    <ul className="rules-list">
                        {rules.map((r) => (
                            <li key={r.label} className={`rule-item ${r.ok ? "rule-item--ok" : ""}`}>
                                <span className="rule-dot" />
                                {r.label}
                            </li>
                        ))}
                    </ul>
                )}

                <Input label="Confirm password" type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} error={errors.confirm}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} />

                <button type="submit" className={`btn btn--primary btn--full${loading ? " btn--loading" : ""}`} disabled={loading}>
                    {loading ? <span className="spinner" /> : "Reset password"}
                </button>
            </form>
        </div>
    );
};

export default SetNewPassword;