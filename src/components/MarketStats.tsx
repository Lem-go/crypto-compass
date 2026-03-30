import { Activity, DollarSign, BarChart3, Users } from "lucide-react";

const stats = [
  { label: "القيمة السوقية الكلية", value: "$2.47T", change: "+1.8%", icon: DollarSign, positive: true },
  { label: "حجم التداول 24س", value: "$98.3B", change: "+12.4%", icon: BarChart3, positive: true },
  { label: "هيمنة البيتكوين", value: "53.2%", change: "-0.3%", icon: Activity, positive: false },
  { label: "العملات النشطة", value: "12,847", change: "+24", icon: Users, positive: true },
];

const MarketStats = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card p-5 group hover:glow-primary transition-shadow duration-300">
          <div className="flex items-center justify-between mb-3">
            <stat.icon className="w-5 h-5 text-primary" />
            <span className={`text-xs font-mono font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-bold font-mono">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default MarketStats;
