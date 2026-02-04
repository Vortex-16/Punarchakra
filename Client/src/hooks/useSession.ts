"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

export interface User {
    _id: string;
    email: string;
    name?: string;
    role: "admin" | "user" | "developer";
    token: string;
    points?: number;
    history?: Array<{
        itemType: string;
        pointsEarned: number;
        date: string;
    }>;
}

export interface ExtendedSession {
    user: User;
    accessToken: string;
}

export function useSession() {
    const { data: session, status } = useNextAuthSession();

    return {
        session: session as ExtendedSession | null,
        user: session?.user as User | null,
        isLoading: status === "loading",
        isAuthenticated: !!session,
        status,
    };
}
