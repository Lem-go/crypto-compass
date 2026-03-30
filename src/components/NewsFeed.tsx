import { forwardRef } from "react";
import { Flame, TrendingUp, Zap, Star } from "lucide-react";
import { useTopMovers } from "@/hooks/useCryptoData";

const icons = [Flame, TrendingUp, Zap, Star, Flame, TrendingUp];

const NewsFeed = forwardRef<HTMLDivElement>((_, ref) => {
  const { data: movers, isLoading, isError } = useTopMovers();

  return (
    <div ref={ref} className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-1">الأكثر تحركاً</h3>
      <p className="text-xs text-muted-foreground mb-5">
        العملات الأعلى نشاطاً خلال 24 ساعة
      </p>

      {isError && (
        <div className="text-sm text-destructive mb-4">
          تعذر تحميل قائمة النشاط الآن.
        </div>
      )}

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-secondary/30 rounded-lg animate-pulse" />
            ))
          : movers?.map((coin, i) => {
              const Icon = icons[i % icons.length];
              const positive = coin.score >= 0;

              return (
                <div
                  key={coin.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{coin.name}</p>
                      <span
                        className={`text-xs font-mono font-medium ${
                          positive ? "text-success" : "text-destructive"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {coin.score.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {coin.symbol}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        المرتبة #{coin.marketCapRank}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
});

NewsFeed.displayName = "NewsFeed";

export default NewsFeed;
