import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await fetch("http://localhost:5000/api/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const user = await res.json();

                    if (res.ok && user) {
                        return user; // Return user object provided by backend
                    }
                    return null;
                } catch (error) {
                    console.error("Login error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const res = await fetch("http://localhost:5000/api/auth/google", {
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

                    const backendUser = await res.json();

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
            // Initial sign in
            if (user) {
                token.user = user;
                // @ts-ignore
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.user) {
                // @ts-ignore
                session.user = token.user;
                // @ts-ignore
                session.accessToken = token.accessToken;
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
    debug: true, // Enable debug messages for development
});
