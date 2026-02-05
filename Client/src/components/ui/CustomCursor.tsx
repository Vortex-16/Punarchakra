"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;
        if (!cursor || !follower) return;

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power2.out"
            });
        };

        const handleHover = (e: MouseEvent) => {
             // @ts-ignore
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
                gsap.to(follower, {
                    scale: 3,
                    opacity: 0.3,
                    duration: 0.3,
                    backgroundColor: "#0F4C3A" // Forest Green
                });
                gsap.to(cursor, {
                    scale: 0.5,
                    backgroundColor: "transparent",
                    border: "1px solid #0F4C3A"
                });
            } else {
                gsap.to(follower, {
                    scale: 1,
                    opacity: 1,
                     duration: 0.3,
                     backgroundColor: "rgba(16, 185, 129, 0.3)" // Default translucent green
                });
                 gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: "#0F4C3A",
                    border: "none"
                });
            }
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseover", handleHover);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleHover);
        };
    }, { scope: cursorRef }); // Scope mainly for cleanup, though window listeners are global

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-forest-green rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block mix-blend-difference"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 border border-forest-green/50 hidden lg:block transition-colors duration-300"
            />
        </>
    );
}
