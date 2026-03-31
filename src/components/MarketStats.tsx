import { Activity, DollarSign, BarChart3, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMarketGlobal, formatUsd } from "@/hooks/useCryptoData";

const MarketStats = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useMarketGlobal();

  const stats = [
    {
      labelKey: "marketStats.marketCap",
      value: data ? formatUsd(data.totalMarketCapUsd) : "—",
      change: data ? `${data.totalMarketCapChange >= 0 ? "+" : ""}${data.totalMarketCapChange.toFixed(1)}%` : "",
      icon: DollarSign,
      positive: data ? data.totalMarketCapChange >= 0 : true,
    },
    {
      labelKey: "marketStats.volume24h",
      value: data ? formatUsd(data.totalVolume24Hr) : "—",
      change: "",
      icon: BarChart3,
      positive: true,
    },
    {
      labelKey: "marketStats.btcDominance",
      value: data ? `${data.btcDominance.toFixed(1)}%` : "—",
      change: "",
      icon: Activity,
      positive: true,
    },
    {
      labelKey: "marketStats.ethereumDominance",
      value: data ? `${data.activeCoins}+` : "—",
      change: "",
      icon: Globe,
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`glass-card p-5 group hover:glow-primary transition-shadow duration-300 ${isLoading ? "animate-pulse" : ""}`}>
          <div className="flex items-center justify-between mb-3">
            <stat.icon className="w-5 h-5 text-primary" />
            {stat.change && (
              <span className={`text-xs font-mono font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>
                {stat.change}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold font-mono">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{t(stat.labelKey)}</p>
        </div>
      ))}
    </div>
  );
};

export default MarketStats;
