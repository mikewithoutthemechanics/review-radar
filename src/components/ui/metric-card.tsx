import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon?: ReactNode;
}

export function MetricCard({ title, value, subtitle, trend, icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-white/[0.1] hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white/50">{title}</p>
        {icon && <div className="text-white/30">{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      {(subtitle || trend !== undefined) && (
        <div className="mt-2 flex items-center gap-2">
          {trend !== undefined && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                trend > 0
                  ? "text-emerald-400"
                  : trend < 0
                  ? "text-red-400"
                  : "text-white/40"
              }`}
            >
              {trend > 0 ? (
                <TrendingUp size={14} />
              ) : trend < 0 ? (
                <TrendingDown size={14} />
              ) : (
                <Minus size={14} />
              )}
              {trend > 0 ? "+" : ""}
              {trend}
            </span>
          )}
          {subtitle && <span className="text-sm text-white/40">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
