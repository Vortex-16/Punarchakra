import React from "react";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type PasswordStrength = "weak" | "medium" | "strong";

interface PasswordStrengthIndicatorProps {
  password: string;
  show?: boolean;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function calculatePasswordStrength(password: string): {
  strength: PasswordStrength;
  requirements: PasswordRequirement[];
  score: number;
} {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      met: /\d/.test(password),
    },
    {
      label: "Contains special character",
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];

  const score = requirements.filter((req) => req.met).length;

  let strength: PasswordStrength = "weak";
  if (score >= 5) strength = "strong";
  else if (score >= 3) strength = "medium";

  return { strength, requirements, score };
}

export default function PasswordStrengthIndicator({
  password,
  show = true,
}: PasswordStrengthIndicatorProps) {
  const { strength, requirements, score } = calculatePasswordStrength(password);

  const strengthConfig = {
    weak: {
      color: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400",
      label: "Weak",
      width: "33.33%",
    },
    medium: {
      color: "bg-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400",
      label: "Medium",
      width: "66.66%",
    },
    strong: {
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      label: "Strong",
      width: "100%",
    },
  };

  const config = strengthConfig[strength];

  if (!show || !password) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3 mt-3"
      >
        {/* Strength Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-600 dark:text-neutral-400">
              Password Strength
            </span>
            <span className={`font-semibold ${config.textColor}`}>
              {config.label}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${config.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: config.width }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="space-y-1.5">
          {requirements.map((req, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 text-xs"
            >
              <div
                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  req.met
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-400"
                }`}
              >
                {req.met ? <Check size={10} /> : <X size={10} />}
              </div>
              <span
                className={`transition-colors ${
                  req.met
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-neutral-500 dark:text-neutral-500"
                }`}
              >
                {req.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
