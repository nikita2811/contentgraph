import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

export const AuthProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [accessToken, setAccessTokenState] =
        useState<string | null>(
            () => localStorage.getItem("access_token")
        );

    const setAccessToken = (
        token: string | null
    ) => {
        if (token) {
            localStorage.setItem(
                "access_token",
                token
            );
        } else {
            localStorage.removeItem(
                "access_token"
            );
        }

        setAccessTokenState(token);
    };

    const value = useMemo(
        () => ({
            accessToken,
            setAccessToken,
        }),
        [accessToken]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};