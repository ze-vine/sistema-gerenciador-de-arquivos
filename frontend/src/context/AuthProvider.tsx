import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./Contexts";
import api from "../api";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem("user");
        return user && user !== "undefined" ? JSON.parse(user) : null;
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.get("/users/me");
                setCurrentUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            } catch (e) {
                localStorage.removeItem("user");
                setCurrentUser(null);
            }
        }

        checkAuth();
    }, []);

    return (
        <AuthContext value={{ currentUser, setCurrentUser }}>
            { children }
        </AuthContext>
    );
}