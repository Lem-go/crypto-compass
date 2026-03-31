import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowUpDown, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCoins, formatPrice } from "@/hooks/useCryptoData";
import CoinDetailModal from "./CoinDetailModal";
import type { CoinData } from "@/hooks/useCryptoData";

const COIN_ICONS: Record<string, string> = {
  bitcoin: "₿", ethereum: "Ξ", solana: "◎", cardano: "₳", polkadot: "●",
  avalanche: "▲", chainlink: "⬡", dogecoin: "Ð", binancecoin: "B",
  xrp: "✕", tether: "₮", litecoin: "Ł",
};

type SortKey = "rank" | "price" | "change" | "mcap";

const CoinTable = () => {
  const { t, i18n } = useTranslation();
  const { data: coins, isLoading, isError, dataUpdatedAt } = useCoins();
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key === "rank"); }
  };

  const sorted = coins ? [...coins].sort((a, b) => {
    let diff = 0;
    switch (sortKey) {
      case "rank": diff = Number(a.rank) - Number(b.rank); break;
      case "price": diff = Number.parseFloat(a.priceUsd) - Number.parseFloat(b.priceUsd); break;
      case "change": diff = Number.parseFloat(a.changePercent24Hr) - Number.parseFloat(b.changePercent24Hr); break;
      case "mcap": diff = Number.parseFloat(a.marketCapUsd) - Number.parseFloat(b.marketCapUsd); break;
    }
    return sortAsc ? diff : -diff;
  }) : [];

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString(locale) : "";

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-semibold">{t("coinTable.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t("coinTable.updateFrequency")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdate && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  {i18n.language === 'ar' ? 'آخر تحديث' : 'Last update'}: {lastUpdate}
                </span>
              )}
              {isLoading && (
                <span className="text-xs text-muted-foreground animate-pulse">{i18n.language === 'ar' ? 'جاري التحديث...' : 'Updating...'}</span>
              )}
            </div>
          </div>
        </div>

        {isError && (
          <div className="p-8 text-center text-destructive text-sm">
            {i18n.language === 'ar' ? 'تعذر جلب الأسعار الآن. نحاول التحديث تلقائياً خلال دقيقة.' : 'Unable to fetch prices now. We are trying to update automatically in a minute.'}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <SortTh label="#" sortKey="rank" current={sortKey} asc={sortAsc} onClick={toggleSort} />
                <th className="text-right text-xs text-muted-foreground font-medium p-4">{t("coinTable.name")}</th>
                <SortTh label={t("coinTable.price")} sortKey="price" current={sortKey} asc={sortAsc} onClick={toggleSort} />
                <SortTh label={t("coinTable.change24h")} sortKey="change" current={sortKey} asc={sortAsc} onClick={toggleSort} />
                <SortTh label={t("coinTable.marketCap")} sortKey="mcap" current={sortKey} asc={sortAsc} onClick={toggleSort} className="hidden sm:table-cell" />
                <th className="text-right text-xs text-muted-foreground font-medium p-4 hidden md:table-cell">{i18n.language === 'ar' ? 'الاتجاه' : 'Trend'}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !coins
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/20">
                      <td colSpan={6} className="p-4">
                        <div className="h-8 bg-secondary/50 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : sorted.map((coin) => {
                    const change = Number.parseFloat(coin.changePercent24Hr);
                    const mcap = Number.parseFloat(coin.marketCapUsd);
                    const mcapStr = mcap >= 1e12 ? `$${(mcap / 1e12).toFixed(2)}T` : mcap >= 1e9 ? `$${(mcap / 1e9).toFixed(1)}B` : `$${(mcap / 1e6).toFixed(0)}M`;

                    return (
                      <tr
                        key={coin.id}
                        onClick={() => setSelectedCoin(coin)}
                        className="border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer group"
                      >
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
                          <SparkLine prices={coin.sparkline} positive={change >= 0} />
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCoin && <CoinDetailModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />}
    </>
  );
};

const SortTh = ({
  label, sortKey, current, asc, onClick, className = "",
}: {
  label: string; sortKey: SortKey; current: SortKey; asc: boolean; onClick: (k: SortKey) => void; className?: string;
}) => (
  <th
    onClick={() => onClick(sortKey)}
    className={`text-right text-xs text-muted-foreground font-medium p-4 cursor-pointer hover:text-foreground transition-colors select-none ${className}`}
  >
    <span className="inline-flex items-center gap-1">
      {label}
      {current === sortKey ? (
        <ChevronDown className={`w-3 h-3 transition-transform ${asc ? "" : "rotate-180"}`} />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-40" />
      )}
    </span>
  </th>
);

const SparkLine = ({ prices, positive }: { prices: number[]; positive: boolean }) => {
  if (!prices || prices.length < 2) return <div className="w-20 h-8" />;
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;
  const normalize = (v: number) => 2 + ((v - min) / range) * 26;
  const step = 80 / (prices.length - 1);
  const points = prices.map((p, i) => `${i * step},${30 - normalize(p)}`).join(" ");

  return (
    <svg width="80" height="30" viewBox="0 0 80 30" className="opacity-80">
      <polyline points={points} fill="none" stroke={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default CoinTable;
