import { TrendingUp, TrendingDown } from "lucide-react";
import { useCoins, useCoinHistory, formatPrice } from "@/hooks/useCryptoData";

const COIN_ICONS: Record<string, string> = {
  bitcoin: "₿", ethereum: "Ξ", solana: "◎", cardano: "₳",
  polkadot: "●", avalanche: "▲", chainlink: "⬡", dogecoin: "Ð",
  "binance-coin": "B", "xrp": "✕", tether: "₮", litecoin: "Ł",
};

const CoinTable = () => {
  const { data: coins, isLoading, isError } = useCoins();

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">أبرز العملات</h2>
            <p className="text-sm text-muted-foreground mt-1">أسعار مباشرة — تتحدث كل 30 ثانية</p>
          </div>
          {isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse">جاري التحديث...</span>
          )}
        </div>
      </div>

      {isError && (
        <div className="p-8 text-center text-destructive text-sm">فشل تحميل البيانات. يرجى المحاولة لاحقاً.</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-right text-xs text-muted-foreground font-medium p-4">#</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4">العملة</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4">السعر</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4">التغيير 24س</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4 hidden sm:table-cell">القيمة السوقية</th>
              <th className="text-right text-xs text-muted-foreground font-medium p-4 hidden md:table-cell">24س</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && !coins
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td colSpan={6} className="p-4"><div className="h-8 bg-secondary/50 rounded animate-pulse" /></td>
                  </tr>
                ))
              : coins?.map((coin) => {
                  const change = parseFloat(coin.changePercent24Hr);
                  const mcap = parseFloat(coin.marketCapUsd);
                  const mcapStr = mcap >= 1e12 ? `$${(mcap / 1e12).toFixed(2)}T` : mcap >= 1e9 ? `$${(mcap / 1e9).toFixed(1)}B` : `$${(mcap / 1e6).toFixed(0)}M`;

                  return (
                    <tr key={coin.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer group">
                      <td className="p-4 text-sm text-muted-foreground">{coin.rank}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-primary group-hover:glow-primary transition-shadow">
                            {COIN_ICONS[coin.id] || coin.symbol.charAt(0)}
                          </span>
                          <div>
                            <p className="font-semibold text-sm">{coin.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm font-medium">{formatPrice(coin.priceUsd)}</td>
                      <td className="p-4">
                        <div className={`flex items-center gap-1 text-sm font-mono font-medium ${change >= 0 ? "text-success" : "text-destructive"}`}>
                          {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground font-mono hidden sm:table-cell">{mcapStr}</td>
                      <td className="p-4 hidden md:table-cell">
                        <SparkLine coinId={coin.id} positive={change >= 0} />
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SparkLine = ({ coinId, positive }: { coinId: string; positive: boolean }) => {
  const { data } = useCoinHistory(coinId);
  if (!data || data.length < 2) return <div className="w-20 h-8" />;

  const prices = data.map((d) => parseFloat(d.priceUsd));
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;
  const normalize = (v: number) => 2 + ((v - min) / range) * 26;
  const step = 80 / (prices.length - 1);
  const d = prices.map((p, i) => `${i * step},${30 - normalize(p)}`).join(" L");

  return (
    <svg width="80" height="30" viewBox="0 0 80 30" className="opacity-80">
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
