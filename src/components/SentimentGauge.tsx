import { forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFearGreedIndex } from "@/hooks/useCryptoData";

const SentimentGauge = forwardRef<HTMLDivElement>((_, ref) => {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useFearGreedIndex();
  const value = data?.value ?? 50;

  const getLabelForClassification = (classification: string): string => {
    const keyMap: Record<string, string> = {
      "Extreme Fear": "sentimentGauge.extremefear",
      "Fear": "sentimentGauge.fear",
      "Neutral": "sentimentGauge.neutral",
      "Greed": "sentimentGauge.greed",
      "Extreme Greed": "sentimentGauge.extremegreed",
    };

    return t(keyMap[classification] || "sentimentGauge.neutral", { defaultValue: classification });
  };

  const label = data ? getLabelForClassification(data.classification) : (i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...');

  const color =
    value >= 75
      ? "var(--success)"
      : value >= 55
      ? "var(--primary)"
      : value >= 45
      ? "var(--warning)"
      : value >= 25
      ? "var(--warning)"
      : "var(--destructive)";

  const rotation = useMemo(() => -90 + (value / 100) * 180, [value]);

  return (
    <div ref={ref} className={`glass-card p-6 flex flex-col items-center ${isLoading ? "animate-pulse" : ""}`}>
      <h3 className="text-lg font-semibold mb-1">{t("sentimentGauge.title")}</h3>

      <div className="relative w-48 h-28 mb-4">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--destructive))" />
              <stop offset="30%" stopColor="hsl(var(--warning))" />
              <stop offset="60%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--success))" />
            </linearGradient>
          </defs>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 251.2} 251.2`}
          />
          <g transform={`rotate(${rotation}, 100, 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke="hsl(var(--foreground))"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="5" fill={`hsl(${color})`} />
          </g>
        </svg>
      </div>

      <div className="text-center">
        <span className="text-4xl font-bold font-mono" style={{ color: `hsl(${color})` }}>
          {value}
        </span>
        <p className="text-sm font-medium mt-1" style={{ color: `hsl(${color})` }}>
          {label}
        </p>
      </div>
    </div>
  );
});

SentimentGauge.displayName = "SentimentGauge";

export default SentimentGauge;
