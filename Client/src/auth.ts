import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";

// Build providers array - Google is only added if credentials exist
const providers: Provider[] = [];

// Only add Google provider if credentials are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

// Always add Credentials provider
providers.push(
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

            try {
                const res = await fetch(`${apiUrl}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                });

                const responseText = await res.text();

                try {
                    const user = JSON.parse(responseText);
                    if (res.ok && user) {
                        return user;
                    }
                    console.error("Login failed (Server):", user);
                } catch (jsonError) {
                    console.error("Login failed (Non-JSON response):", responseText);
                }

                return null;
            } catch (error) {
                console.error("Login connection error:", error);
                return null;
            }
        },
    })
);

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
                try {
                    const res = await fetch(`${apiUrl}/auth/google`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: user.name,
                            email: user.email,
                            googleId: account.providerAccountId,
                        }),
                    });

                    const responseText = await res.text();
                    let backendUser;

                    try {
                        backendUser = JSON.parse(responseText);
                    } catch (e) {
                        console.error("Google Auth: Non-JSON response:", responseText);
                        return false;
                    }

                    if (res.ok && backendUser) {
                        // Attach backend token to the user object so it persists in the JWT
                        // @ts-ignore
                        user.token = backendUser.token;
                        // @ts-ignore
                        user.role = backendUser.role;
                        // @ts-ignore
                        user._id = backendUser._id;
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Google Auth Backend Sync Error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign in: Persist the user (including backend token) to the JWT
            if (user) {
                return {
                    ...token,
                    user: user, // Store the whole user including .token
                    accessToken: (user as any).token
                };
            }
            // Trigger update (e.g. points change)
            if (trigger === "update" && session?.user) {
                return { ...token, user: session.user };
            }
            return token;
        },
        async session({ session, token }) {
            // Forward the user data from JWT to the client Session
            if (token?.user) {
                session.user = token.user as any;
                (session as any).accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
});
