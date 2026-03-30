import { Activity, DollarSign, BarChart3, Globe } from "lucide-react";
import { useMarketGlobal, formatUsd } from "@/hooks/useCryptoData";

const MarketStats = () => {
  const { data, isLoading } = useMarketGlobal();

  const stats = [
    {
      label: "القيمة السوقية الكلية",
      value: data ? formatUsd(data.totalMarketCapUsd) : "—",
      change: data ? `${data.totalMarketCapChange >= 0 ? "+" : ""}${data.totalMarketCapChange.toFixed(1)}%` : "",
      icon: DollarSign,
      positive: data ? data.totalMarketCapChange >= 0 : true,
    },
    {
      label: "حجم التداول 24س",
      value: data ? formatUsd(data.totalVolume24Hr) : "—",
      change: "",
      icon: BarChart3,
      positive: true,
    },
    {
      label: "هيمنة البيتكوين",
      value: data ? `${data.btcDominance.toFixed(1)}%` : "—",
      change: "",
      icon: Activity,
      positive: true,
    },
    {
      label: "العملات المتتبعة",
      value: data ? `${data.activeCoins}+` : "—",
      change: "",
      icon: Globe,
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`glass-card p-5 group hover:glow-primary transition-shadow duration-300 ${isLoading ? "animate-pulse" : ""}`}>
          <div className="flex items-center justify-between mb-3">
            <stat.icon className="w-5 h-5 text-primary" />
            {stat.change && (
              <span className={`text-xs font-mono font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>
                {stat.change}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold font-mono">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default MarketStats;
