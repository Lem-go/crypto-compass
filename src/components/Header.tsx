import { useState, useRef, useEffect } from "react";
import { Search, X, Menu } from "lucide-react";
import { useCoins, formatPrice } from "@/hooks/useCryptoData";

const NAV_ITEMS = [
  { label: "لوحة التحكم", target: "stats" },
  { label: "العملات", target: "coins" },
  { label: "مؤشر السوق", target: "sentiment" },
  { label: "المحوّل", target: "converter" },
  { label: "الأكثر تحركاً", target: "movers" },
];

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: coins } = useCoins();

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const filtered = query.trim()
    ? coins?.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.symbol.toLowerCase().includes(query.toLowerCase())
      ) ?? []
    : [];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Crypto<span className="text-gradient-primary">Lens</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.target}
              onClick={() => scrollTo(item.target)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setQuery(""); }}
              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              {searchOpen ? <X className="w-4 h-4 text-muted-foreground" /> : <Search className="w-4 h-4 text-muted-foreground" />}
            </button>

            {searchOpen && (
              <div className="absolute top-12 left-0 md:left-auto md:right-0 w-72 glass-card rounded-xl shadow-xl border border-border/50 overflow-hidden z-50">
                <div className="p-3 border-b border-border/30">
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث عن عملة..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    dir="rtl"
                  />
                </div>
                {query.trim() && (
                  <div className="max-h-64 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <p className="p-4 text-xs text-muted-foreground text-center">لا توجد نتائج</p>
                    ) : (
                      filtered.map((coin) => {
                        const change = Number.parseFloat(coin.changePercent24Hr);
                        return (
                          <button
                            key={coin.id}
                            onClick={() => { scrollTo("coins"); setSearchOpen(false); setQuery(""); }}
                            className="w-full flex items-center justify-between gap-2 p-3 hover:bg-secondary/40 transition-colors text-right"
                          >
                            <div>
                              <p className="text-sm font-medium">{coin.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{coin.symbol}</p>
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-mono">{formatPrice(coin.priceUsd)}</p>
                              <p className={`text-xs font-mono ${change >= 0 ? "text-success" : "text-destructive"}`}>
                                {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-muted-foreground" /> : <Menu className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border/30 bg-background/90 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.target}
                onClick={() => scrollTo(item.target)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-lg hover:bg-secondary/40 text-right"
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
