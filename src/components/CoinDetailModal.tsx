import { X, TrendingUp, TrendingDown, BarChart3, DollarSign, Coins } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CoinData, formatPrice, formatUsd } from "@/hooks/useCryptoData";

interface CoinDetailModalProps {
  coin: CoinData;
  onClose: () => void;
}

const CoinDetailModal = ({ coin, onClose }: CoinDetailModalProps) => {
  const { t, i18n } = useTranslation();
  const change = Number.parseFloat(coin.changePercent24Hr);
  const mcap = Number.parseFloat(coin.marketCapUsd);
  const volume = Number.parseFloat(coin.volumeUsd24Hr);
  const supply = Number.parseFloat(coin.supply);
  const price = Number.parseFloat(coin.priceUsd);
  const positive = change >= 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative glass-card w-full max-w-lg p-6 shadow-2xl border border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl font-bold text-primary">
            {coin.symbol.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{coin.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-muted-foreground font-mono">{coin.symbol}</span>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded">{i18n.language === 'ar' ? 'المرتبة' : 'Rank'} #{coin.rank}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <p className="text-3xl font-bold font-mono">{formatPrice(coin.priceUsd)}</p>
          <div className={`flex items-center gap-1 mt-1 text-sm font-mono font-medium ${positive ? "text-success" : "text-destructive"}`}>
            {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {positive ? "+" : ""}{change.toFixed(2)}% {i18n.language === 'ar' ? 'خلال 24 ساعة' : 'in 24 hours'}
          </div>
        </div>

        {/* Sparkline */}
        {coin.sparkline.length > 2 && (
          <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">{i18n.language === 'ar' ? 'اتجاه السعر — آخر 7 أيام' : 'Price trend — Last 7 days'}</p>
            <SparkLineLarge prices={coin.sparkline} positive={positive} />
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatItem icon={DollarSign} label={t("marketStats.marketCap")} value={formatUsd(mcap)} />
          <StatItem icon={BarChart3} label={t("marketStats.volume24h")} value={formatUsd(volume)} />
          <StatItem icon={Coins} label={i18n.language === 'ar' ? 'المعروض المتداول' : 'Circulating Supply'} value={supply >= 1e9 ? `${(supply / 1e9).toFixed(1)}B` : supply >= 1e6 ? `${(supply / 1e6).toFixed(1)}M` : supply.toLocaleString()} />
          <StatItem icon={DollarSign} label={i18n.language === 'ar' ? 'السعر / وحدة' : 'Price per unit'} value={price < 0.01 ? `$${price.toFixed(8)}` : formatPrice(coin.priceUsd)} />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="p-3 bg-secondary/30 rounded-lg">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
    <p className="text-sm font-mono font-medium">{value}</p>
  </div>
);

const SparkLineLarge = ({ prices, positive }: { prices: number[]; positive: boolean }) => {
  const W = 400;
  const H = 80;
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;
  const step = W / (prices.length - 1);
  const points = prices.map((p, i) => `${i * step},${H - 4 - ((p - min) / range) * (H - 8)}`).join(" ");
  const fillPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#sparkFill)" />
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CoinDetailModal;
