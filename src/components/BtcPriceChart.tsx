import { useTranslation } from "react-i18next";
import { useCoins, formatPrice } from "@/hooks/useCryptoData";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BtcPriceChart = () => {
  const { t, i18n } = useTranslation();
  const { data: coins, isLoading } = useCoins();
  const btc = coins?.find((c) => c.id === "bitcoin");
  const sparkline = btc?.sparkline ?? [];

  if (isLoading || sparkline.length < 10) {
    return (
      <div className="glass-card p-6">
        <div className="h-48 bg-secondary/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  const change = Number.parseFloat(btc?.changePercent24Hr ?? "0");
  const positive = change >= 0;

  // Sample every ~4th point for a cleaner chart (7 days of data)
  const step = Math.max(1, Math.floor(sparkline.length / 42));
  const chartData = sparkline
    .filter((_, i) => i % step === 0 || i === sparkline.length - 1)
    .map((price, i, arr) => ({
      idx: i,
      price,
      label: `${Math.round((i / (arr.length - 1)) * 7)} ${i18n.language === 'ar' ? 'أيام' : 'days'}`,
    }));

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold">{t("btcChart.title")} — {i18n.language === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {i18n.language === 'ar' ? 'السعر الحالي' : 'Current price'}: <span className="font-mono text-foreground">{formatPrice(btc?.priceUsd ?? "0")}</span>
            <span className={`mr-2 font-mono text-xs ${positive ? "text-success" : "text-destructive"}`}>
              ({positive ? "+" : ""}{change.toFixed(2)}%)
            </span>
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={positive ? "hsl(145, 70%, 45%)" : "hsl(0, 72%, 55%)"}
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor={positive ? "hsl(145, 70%, 45%)" : "hsl(0, 72%, 55%)"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip
            contentStyle={{
              background: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace",
            }}
            labelFormatter={() => ""}
            formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, i18n.language === 'ar' ? "السعر" : "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={positive ? "hsl(145, 70%, 45%)" : "hsl(0, 72%, 55%)"}
            strokeWidth={2}
            fill="url(#btcGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BtcPriceChart;
