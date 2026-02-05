"use client";

import { ReactNode, CSSProperties } from "react";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
  delay?: number;
}

export default function FloatingElement({
  children,
  className = "",
  duration = 6,
  distance = 20,
  delay = 0,
}: FloatingElementProps) {
  const animationStyle: CSSProperties = {
    animation: `float ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    "--float-distance": `${distance}px`,
  } as CSSProperties;

  return (
    <div className={`floating ${className}`} style={animationStyle}>
      {children}
    </div>
  );
}
