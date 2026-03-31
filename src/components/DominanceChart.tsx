import { useMarketGlobal } from "@/hooks/useCryptoData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const DominanceChart = () => {
  const { data, isLoading } = useMarketGlobal();

  if (isLoading || !data) {
    return (
      <div className="glass-card p-6">
        <div className="h-40 bg-secondary/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  const btc = data.btcDominance;
  const others = 100 - btc;

  const chartData = [
    { name: "Bitcoin", value: Number(btc.toFixed(1)), color: "hsl(38, 90%, 55%)" },
    { name: "أخرى", value: Number(others.toFixed(1)), color: "hsl(220, 14%, 25%)" },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-1">هيمنة البيتكوين</h3>
      <p className="text-xs text-muted-foreground mb-4">نسبة القيمة السوقية للبيتكوين من إجمالي السوق</p>

      <div className="flex items-center gap-4">
        <div className="w-28 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 flex-1">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-mono font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DominanceChart;
