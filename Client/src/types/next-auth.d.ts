import "next-auth";

declare module "next-auth" {
    interface User {
        _id: string;
        email: string;
        name?: string;
        role: "admin" | "user" | "developer";
        token: string;
    }

    interface Session {
        user: User;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: User;
        accessToken: string;
    }
}
