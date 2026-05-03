import { createContext } from "react";
import type { IAuthContext } from "../@types/auth-context";

export const AuthContext = createContext<IAuthContext | null>(null);