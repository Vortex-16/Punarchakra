"use client";

import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  borderWidth?: number;
  borderRadius?: string;
  animationDuration?: number;
}

export default function GradientBorder({
  children,
  className = "",
  colors = ["#10b981", "#14b8a6", "#22c55e"],
  borderWidth = 2,
  borderRadius = "16px",
  animationDuration = 6,
}: GradientBorderProps) {
  const gradientString = `linear-gradient(45deg, ${colors.join(", ")}, ${colors[0]})`;

  return (
    <div
      className={`relative ${className}`}
      style={{
        borderRadius,
      }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute -inset-[2px] rounded-[inherit]"
        style={{
          background: gradientString,
          backgroundSize: "300% 300%",
          animation: `gradient-xy ${animationDuration}s ease infinite`,
          padding: `${borderWidth}px`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          zIndex: -1,
        }}
      />
      {/* Content */}
      <div className="relative z-10 bg-white dark:bg-[#0a0a0a] rounded-[inherit]">
        {children}
      </div>
    </div>
  );
}
