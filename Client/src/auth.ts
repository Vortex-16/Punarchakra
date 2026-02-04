import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
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
                        // Return user object including the token
                        return user;
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
