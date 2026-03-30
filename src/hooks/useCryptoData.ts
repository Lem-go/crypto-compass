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
  sparkline: number[];
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

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  marketCapRank: number;
  score: number;
}

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} while requesting ${url}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export function useCoins() {
  return useQuery<CoinData[]>({
    queryKey: ["coins"],
    queryFn: async () => {
      const data = await fetchJson<
        Array<{
          id: string;
          symbol: string;
          name: string;
          market_cap_rank: number;
          current_price: number;
          price_change_percentage_24h: number;
          market_cap: number;
          total_volume: number;
          circulating_supply: number;
          sparkline_in_7d?: { price: number[] };
        }>
      >(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`
      );

      return data.map((coin) => ({
        id: coin.id,
        rank: String(coin.market_cap_rank ?? 0),
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        priceUsd: String(coin.current_price ?? 0),
        changePercent24Hr: String(coin.price_change_percentage_24h ?? 0),
        marketCapUsd: String(coin.market_cap ?? 0),
        volumeUsd24Hr: String(coin.total_volume ?? 0),
        supply: String(coin.circulating_supply ?? 0),
        sparkline: coin.sparkline_in_7d?.price ?? [],
      }));
    },
    refetchInterval: 60000,
    staleTime: 20000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useMarketGlobal() {
  return useQuery<MarketGlobal>({
    queryKey: ["marketGlobal"],
    queryFn: async () => {
      const json = await fetchJson<{
        data: {
          active_cryptocurrencies: number;
          total_market_cap: { usd: number };
          total_volume: { usd: number };
          market_cap_percentage: { btc: number };
          market_cap_change_percentage_24h_usd?: number;
        };
      }>(`${COINGECKO_BASE}/global`);

      return {
        totalMarketCapUsd: json.data.total_market_cap?.usd ?? 0,
        totalVolume24Hr: json.data.total_volume?.usd ?? 0,
        btcDominance: json.data.market_cap_percentage?.btc ?? 0,
        activeCoins: json.data.active_cryptocurrencies ?? 0,
        totalMarketCapChange: json.data.market_cap_change_percentage_24h_usd ?? 0,
      };
    },
    refetchInterval: 120000,
    staleTime: 30000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useTopMovers() {
  return useQuery<TrendingCoin[]>({
    queryKey: ["topMovers"],
    queryFn: async () => {
      const data = await fetchJson<
        Array<{
          id: string;
          name: string;
          symbol: string;
          market_cap_rank: number;
          price_change_percentage_24h: number;
        }>
      >(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=volume_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
      );

      return [...data]
        .sort(
          (a, b) =>
            Math.abs(b.price_change_percentage_24h ?? 0) -
            Math.abs(a.price_change_percentage_24h ?? 0)
        )
        .slice(0, 6)
        .map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          marketCapRank: coin.market_cap_rank ?? 0,
          score: coin.price_change_percentage_24h ?? 0,
        }));
    },
    refetchInterval: 120000,
    staleTime: 30000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useFearGreedIndex() {
  return useQuery<FearGreedData>({
    queryKey: ["fearGreed"],
    queryFn: async () => {
      const json = await fetchJson<{
        data: Array<{ value: string; value_classification: string }>;
      }>("https://api.alternative.me/fng/?limit=1");

      const row = json.data[0];
      return {
        value: Number.parseInt(row?.value ?? "50", 10),
        classification: row?.value_classification ?? "Neutral",
      };
    },
    refetchInterval: 300000,
    staleTime: 120000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function formatUsd(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatPrice(priceStr: string): string {
  const price = Number.parseFloat(priceStr);
  if (!Number.isFinite(price)) return "$0.00";
  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}
