import { ReactNode } from "react";

const variants = {
  positive: "bg-emerald-100 text-emerald-800",
  neutral: "bg-amber-100 text-amber-800",
  negative: "bg-red-100 text-red-800",
  google: "bg-blue-100 text-blue-800",
  facebook: "bg-indigo-100 text-indigo-800",
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800",
  dismissed: "bg-gray-100 text-gray-600",
  default: "bg-gray-100 text-gray-800",
} as const;

type BadgeVariant = keyof typeof variants;

export function Badge({
  variant = "default",
  children,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
