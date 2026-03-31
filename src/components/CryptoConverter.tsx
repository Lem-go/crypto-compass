import { useState } from "react";
import { ArrowRightLeft, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCoins, formatPrice } from "@/hooks/useCryptoData";

const CryptoConverter = () => {
  const { t, i18n } = useTranslation();
  const { data: coins, isLoading } = useCoins();
  const [amount, setAmount] = useState("1");
  const [fromCoin, setFromCoin] = useState("bitcoin");
  const [toCoin, setToCoin] = useState("ethereum");

  const fromPrice = coins?.find((c) => c.id === fromCoin);
  const toPrice = coins?.find((c) => c.id === toCoin);

  const fromVal = Number.parseFloat(fromPrice?.priceUsd ?? "0");
  const toVal = Number.parseFloat(toPrice?.priceUsd ?? "0");
  const inputAmount = Number.parseFloat(amount) || 0;

  const result = toVal > 0 ? (inputAmount * fromVal) / toVal : 0;
  const usdValue = inputAmount * fromVal;

  const swap = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-1">{t("cryptoConverter.title")}</h3>
      <p className="text-xs text-muted-foreground mb-5">{i18n.language === 'ar' ? 'تحويل فوري بأسعار السوق الحقيقية' : 'Instant conversion at real market prices'}</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-secondary/30 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* From */}
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
              className="flex-1 bg-secondary/50 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-primary border border-border/30"
              placeholder={i18n.language === 'ar' ? 'الكمية' : 'Amount'}
            />
            <select
              value={fromCoin}
              onChange={(e) => setFromCoin(e.target.value)}
              className="w-28 bg-secondary/50 rounded-lg px-2 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary border border-border/30 cursor-pointer"
            >
              {coins?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={swap}
              className="w-9 h-9 rounded-full bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors group"
            >
              <ArrowRightLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* To */}
          <div className="flex gap-2">
            <div className="flex-1 bg-secondary/50 rounded-lg px-3 py-2.5 text-sm font-mono border border-border/30 text-foreground">
              {result > 0 ? result.toLocaleString(undefined, { maximumFractionDigits: 8 }) : "0"}
            </div>
            <select
              value={toCoin}
              onChange={(e) => setToCoin(e.target.value)}
              className="w-28 bg-secondary/50 rounded-lg px-2 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary border border-border/30 cursor-pointer"
            >
              {coins?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* USD equivalent */}
          {usdValue > 0 && (
            <div className="text-center pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                {i18n.language === 'ar' ? 'القيمة بالدولار' : 'USD Value'}: <span className="font-mono text-foreground">${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3" />
                {i18n.language === 'ar' ? 'أسعار مباشرة — تحديث كل دقيقة' : 'Live prices — Updates every minute'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoConverter;
