"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLandingPage = pathname === "/home";

    if (isLandingPage) {
        return <div className="min-h-screen bg-background">{children}</div>;
    }

    return (
        <div className="flex h-screen w-full relative overflow-hidden">
            <Sidebar />
            <MobileNav />
            <main className="flex-1 ml-0 md:ml-64 h-screen overflow-y-auto bg-background transition-all duration-300 p-6 md:p-8 pb-24 md:pb-8">
                {children}
            </main>
        </div>
    );
}
