"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  className = "",
  decimals = 0,
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = easeOut * value;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    updateCount();
  }, [value, duration, isVisible]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}
