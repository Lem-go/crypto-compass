import { Flame, TrendingUp, Zap, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  score: number;
}

const useTrending = () => {
  return useQuery<TrendingCoin[]>({
    queryKey: ["trending"],
    queryFn: async () => {
      // CoinCap doesn't have trending, so we derive from top movers
      const res = await fetch("https://api.coincap.io/v2/assets?limit=50");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const coins = json.data as { id: string; name: string; symbol: string; rank: string; changePercent24Hr: string }[];
      
      // Sort by absolute change to find most active
      const sorted = [...coins].sort((a, b) => 
        Math.abs(parseFloat(b.changePercent24Hr || "0")) - Math.abs(parseFloat(a.changePercent24Hr || "0"))
      );

      return sorted.slice(0, 6).map((c, i) => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        market_cap_rank: parseInt(c.rank),
        score: parseFloat(c.changePercent24Hr || "0"),
      }));
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
};

const icons = [Flame, TrendingUp, Zap, Star, Flame, TrendingUp];

const NewsFeed = () => {
  const { data: trending, isLoading } = useTrending();

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-1">الأكثر تحركاً</h3>
      <p className="text-xs text-muted-foreground mb-5">العملات الأكثر نشاطاً خلال 24 ساعة</p>
      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-secondary/30 rounded-lg animate-pulse" />
            ))
          : trending?.map((coin, i) => {
              const Icon = icons[i % icons.length];
              const positive = coin.score >= 0;
              return (
                <div key={coin.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:glow-primary transition-shadow">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{coin.name}</p>
                      <span className={`text-xs font-mono font-medium ${positive ? "text-success" : "text-destructive"}`}>
                        {positive ? "+" : ""}{coin.score.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground font-mono">{coin.symbol}</span>
                      <span className="text-[10px] text-muted-foreground">المرتبة #{coin.market_cap_rank}</span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default NewsFeed;
