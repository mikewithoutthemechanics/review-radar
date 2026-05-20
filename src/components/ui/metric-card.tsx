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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {(subtitle || trend !== undefined) && (
        <div className="mt-2 flex items-center gap-2">
          {trend !== undefined && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                trend > 0
                  ? "text-emerald-600"
                  : trend < 0
                  ? "text-red-600"
                  : "text-gray-500"
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
          {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
