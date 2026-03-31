import { useCoins, formatPrice } from "@/hooks/useCryptoData";
import { TrendingUp, TrendingDown } from "lucide-react";

const MarketTicker = () => {
  const { data: coins } = useCoins();

  if (!coins || coins.length === 0) return null;

  const top5 = coins.slice(0, 5);

  return (
    <div className="border-b border-border/30 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 py-2 overflow-x-auto scrollbar-hide">
          {top5.map((coin) => {
            const change = Number.parseFloat(coin.changePercent24Hr);
            const positive = change >= 0;
            return (
              <div key={coin.id} className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-muted-foreground">{coin.symbol}</span>
                <span className="text-xs font-mono text-foreground">{formatPrice(coin.priceUsd)}</span>
                <span className={`flex items-center gap-0.5 text-[10px] font-mono ${positive ? "text-success" : "text-destructive"}`}>
                  {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {positive ? "+" : ""}{change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
