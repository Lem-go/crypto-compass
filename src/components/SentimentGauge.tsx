import { useFearGreedIndex } from "@/hooks/useCryptoData";
import { useMemo } from "react";

const LABELS: Record<string, string> = {
  "Extreme Fear": "خوف شديد",
  "Fear": "خوف",
  "Neutral": "محايد",
  "Greed": "طمع",
  "Extreme Greed": "طمع شديد",
};

const SentimentGauge = () => {
  const { data, isLoading } = useFearGreedIndex();
  const value = data?.value ?? 50;
  const label = data ? (LABELS[data.classification] || data.classification) : "جاري التحميل...";

  const color = value >= 75 ? "var(--success)" : value >= 55 ? "var(--primary)" : value >= 45 ? "var(--warning)" : value >= 25 ? "var(--warning)" : "var(--destructive)";
  const rotation = useMemo(() => -90 + (value / 100) * 180, [value]);

  return (
    <div className={`glass-card p-6 flex flex-col items-center ${isLoading ? "animate-pulse" : ""}`}>
      <h3 className="text-lg font-semibold mb-1">مؤشر الخوف والطمع</h3>
      <p className="text-xs text-muted-foreground mb-6">بيانات مباشرة من Alternative.me</p>

      <div className="relative w-48 h-28 mb-4">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" />
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--destructive))" />
              <stop offset="30%" stopColor="hsl(var(--warning))" />
              <stop offset="60%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--success))" />
            </linearGradient>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(value / 100) * 251.2} 251.2`} />
          <g transform={`rotate(${rotation}, 100, 100)`}>
            <line x1="100" y1="100" x2="100" y2="35" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="100" r="5" fill={`hsl(${color})`} />
          </g>
        </svg>
      </div>

      <div className="text-center">
        <span className="text-4xl font-bold font-mono" style={{ color: `hsl(${color})` }}>{value}</span>
        <p className="text-sm font-medium mt-1" style={{ color: `hsl(${color})` }}>{label}</p>
      </div>
    </div>
  );
};

export default SentimentGauge;
