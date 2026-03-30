import { useQuery } from "@tanstack/react-query";

export interface CoinData {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  supply: string;
}

export interface MarketGlobal {
  totalMarketCapUsd: number;
  totalVolume24Hr: number;
  btcDominance: number;
  activeCoins: number;
  totalMarketCapChange: number;
}

export interface FearGreedData {
  value: number;
  classification: string;
}

const COINCAP_BASE = "https://api.coincap.io/v2";

// Fetch top coins from CoinCap (free, no key)
export function useCoins() {
  return useQuery<CoinData[]>({
    queryKey: ["coins"],
    queryFn: async () => {
      const res = await fetch(`${COINCAP_BASE}/assets?limit=10`);
      if (!res.ok) throw new Error("Failed to fetch coins");
      const json = await res.json();
      return json.data as CoinData[];
    },
    refetchInterval: 30000, // refresh every 30s
    staleTime: 15000,
  });
}

// Fetch 24h history for sparkline
export function useCoinHistory(coinId: string) {
  return useQuery<{ priceUsd: string; time: number }[]>({
    queryKey: ["coinHistory", coinId],
    queryFn: async () => {
      const end = Date.now();
      const start = end - 24 * 60 * 60 * 1000;
      const res = await fetch(
        `${COINCAP_BASE}/assets/${coinId}/history?interval=h1&start=${start}&end=${end}`
      );
      if (!res.ok) throw new Error("Failed to fetch history");
      const json = await res.json();
      return json.data;
    },
    staleTime: 60000,
  });
}

// Market global stats derived from coin data
export function useMarketGlobal() {
  return useQuery<MarketGlobal>({
    queryKey: ["marketGlobal"],
    queryFn: async () => {
      const res = await fetch(`${COINCAP_BASE}/assets?limit=100`);
      if (!res.ok) throw new Error("Failed to fetch global data");
      const json = await res.json();
      const coins = json.data as CoinData[];

      const totalMarketCap = coins.reduce((sum: number, c: CoinData) => sum + parseFloat(c.marketCapUsd || "0"), 0);
      const totalVolume = coins.reduce((sum: number, c: CoinData) => sum + parseFloat(c.volumeUsd24Hr || "0"), 0);
      const btcCoin = coins.find((c: CoinData) => c.id === "bitcoin");
      const btcDominance = btcCoin ? (parseFloat(btcCoin.marketCapUsd) / totalMarketCap) * 100 : 0;

      return {
        totalMarketCapUsd: totalMarketCap,
        totalVolume24Hr: totalVolume,
        btcDominance,
        activeCoins: coins.length,
        totalMarketCapChange: parseFloat(btcCoin?.changePercent24Hr || "0"),
      };
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

// Fear & Greed Index from alternative.me
export function useFearGreedIndex() {
  return useQuery<FearGreedData>({
    queryKey: ["fearGreed"],
    queryFn: async () => {
      const res = await fetch("https://api.alternative.me/fng/?limit=1");
      if (!res.ok) throw new Error("Failed to fetch fear & greed");
      const json = await res.json();
      const d = json.data[0];
      return {
        value: parseInt(d.value),
        classification: d.value_classification,
      };
    },
    refetchInterval: 300000, // 5 min
    staleTime: 120000,
  });
}

// Format large numbers
export function formatUsd(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatPrice(priceStr: string): string {
  const price = parseFloat(priceStr);
  if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}
