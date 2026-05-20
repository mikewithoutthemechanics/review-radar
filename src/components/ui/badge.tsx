import { ReactNode } from "react";

const variants = {
  positive: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  neutral: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  negative: "bg-red-500/10 text-red-400 border border-red-500/20",
  google: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  facebook: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  in_progress: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  resolved: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  dismissed: "bg-white/5 text-white/40 border border-white/10",
  default: "bg-white/5 text-white/50 border border-white/10",
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
