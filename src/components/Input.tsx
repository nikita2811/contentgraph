import React, { useState, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, type, ...props }) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="field">
            <label className="field-label">{label}</label>
            <div className={`field-wrap ${error ? "field-wrap--error" : ""}`}>
                {icon && <span className="field-icon">{icon}</span>}
                <input
                    {...props}
                    type={isPassword ? (show ? "text" : "password") : type}
                    className="field-input"
                    style={{ paddingLeft: icon ? "2.5rem" : undefined }}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="field-toggle"
                        onClick={() => setShow((v) => !v)}
                        aria-label={show ? "Hide password" : "Show password"}
                    >
                        {show ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && <p className="field-error">{error}</p>}
        </div>
    );
};

export default Input;