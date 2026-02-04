"use client";
import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    const pathname = usePathname();

    // Disable smooth scroll on these functional/app routes
    const isAppRoute = pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/home") ||
        pathname?.startsWith("/scan") ||
        pathname?.startsWith("/map") ||
        pathname?.startsWith("/rewards") ||
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/smartBin") ||
        pathname?.startsWith("/smart-bin");

    if (isAppRoute) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
