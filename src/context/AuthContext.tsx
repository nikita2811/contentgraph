import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    localStorage.getItem("access_token") // ✅ rehydrate on refresh
    const setAccessToken = (token: string | null) => {
        if (token) {
            localStorage.setItem("access_token", token);
        } else {
            localStorage.removeItem("access_token");
        }
        setAccessTokenState(token);
    };
    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);