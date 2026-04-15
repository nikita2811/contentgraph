import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState<Partial<typeof form>>({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [key]: e.target.value }));
        setErrors((p) => ({ ...p, [key]: "" }));
    };

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.name.trim()) e.name = "Full name is required";
        if (!form.email) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8) e.password = "At least 8 characters";
        if (!form.confirm) e.confirm = "Please confirm your password";
        else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
        return e;
    };

    const strength = (() => {
        const p = form.password;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthClass = ["", "strength--weak", "strength--fair", "strength--good", "strength--strong"][strength];

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        if (!agreed) { alert("Please agree to the terms."); return; }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1400));
        setLoading(false);
        setDone(true);
    };

    if (done) return (
        <div className="card card--center">
            <div className="success-icon">✉</div>
            <h2 className="card-title">Check your inbox</h2>
            <p className="card-sub">We sent a verification link to <strong>{form.email}</strong></p>
            <button className="btn btn--ghost btn--full" onClick={() => navigate("/resend-verification")}>
                Resend verification email
            </button>
            <button className="btn btn--link" onClick={() => navigate("/login")}>Back to sign in</button>
        </div>
    );

    return (
        <div className="card">
            <div className="card-header">
                <h1 className="card-title">Create account</h1>
                <p className="card-sub">Get started — it's free</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <Input label="Full name" type="text" placeholder="Jane Doe" value={form.name} onChange={set("name")} error={errors.name}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>} />
                <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>} />
                <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set("password")} error={errors.password}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>} />

                {form.password && (
                    <div className="strength-bar">
                        <div className="strength-track">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`strength-seg ${i <= strength ? strengthClass : ""}`} />
                            ))}
                        </div>
                        <span className={`strength-label ${strengthClass}`}>{strengthLabel}</span>
                    </div>
                )}

                <Input label="Confirm password" type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} error={errors.confirm}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} />

                <label className="checkbox-label">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    I agree to the <button type="button" className="link">Terms of Service</button> and{" "}
                    <button type="button" className="link">Privacy Policy</button>
                </label>

                <button type="submit" className={`btn btn--primary btn--full${loading ? " btn--loading" : ""}`} disabled={loading}>
                    {loading ? <span className="spinner" /> : "Create account"}
                </button>
            </form>

            <p className="card-footnote">
                Already have an account?{" "}
                <button type="button" className="link" onClick={() => navigate("/signin")}>Sign in</button>
            </p>
        </div>
    );
};

export default Register;