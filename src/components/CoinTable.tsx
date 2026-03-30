import { TrendingUp, TrendingDown } from "lucide-react";

const COINS = [
  { name: "Bitcoin", symbol: "BTC", price: 67842.5, change: 2.34, marketCap: "1.33T", icon: "₿" },
  { name: "Ethereum", symbol: "ETH", price: 3521.8, change: -1.12, marketCap: "423B", icon: "Ξ" },
  { name: "Solana", symbol: "SOL", price: 178.45, change: 5.67, marketCap: "78B", icon: "◎" },
  { name: "Cardano", symbol: "ADA", price: 0.682, change: 3.21, marketCap: "24B", icon: "₳" },
  { name: "Polkadot", symbol: "DOT", price: 8.94, change: -0.45, marketCap: "12B", icon: "●" },
  { name: "Avalanche", symbol: "AVAX", price: 42.18, change: 4.89, marketCap: "16B", icon: "▲" },
  { name: "Chainlink", symbol: "LINK", price: 18.72, change: 1.56, marketCap: "11B", icon: "⬡" },
  { name: "Polygon", symbol: "MATIC", price: 0.891, change: -2.33, marketCap: "8.7B", icon: "⬠" },
];

const CoinTable = () => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <h2 className="text-xl font-semibold">أبرز العملات</h2>
        <p className="text-sm text-muted-foreground mt-1">أسعار محدثة للعملات الرقمية الأكثر تداولاً</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-right text-xs text-muted-foreground font-medium p-4">#</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4">العملة</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4">السعر</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4">التغيير 24س</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4 hidden sm:table-cell">القيمة السوقية</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4 hidden md:table-cell">الرسم البياني</th>
            </tr>
          </thead>
          <tbody>
            {COINS.map((coin, i) => (
              <tr key={coin.symbol} className="border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer group">
                <td className="p-4 text-sm text-muted-foreground">{i + 1}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-primary group-hover:glow-primary transition-shadow">
                      {coin.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{coin.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{coin.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-sm font-medium">${coin.price.toLocaleString()}</td>
                <td className="p-4">
                  <div className={`flex items-center gap-1 text-sm font-mono font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {coin.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {coin.change >= 0 ? "+" : ""}{coin.change}%
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground font-mono hidden sm:table-cell">${coin.marketCap}</td>
                <td className="p-4 hidden md:table-cell">
                  <MiniChart positive={coin.change >= 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MiniChart = ({ positive }: { positive: boolean }) => {
  const points = Array.from({ length: 20 }, (_, i) => {
    const trend = positive ? i * 1.5 : -i * 0.8;
    return 25 + trend + (Math.sin(i * 1.2) * 8) + (Math.random() * 6);
  });
  const max = Math.max(...points);
  const min = Math.min(...points);
  const normalize = (v: number) => 2 + ((v - min) / (max - min || 1)) * 26;
  const d = points.map((p, i) => `${(i / 19) * 80},${30 - normalize(p)}`).join(" L");

  return (
    <svg width="80" height="30" viewBox="0 0 80 30" className="opacity-70">
      <polyline
        points={d}
        fill="none"
        stroke={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CoinTable;
