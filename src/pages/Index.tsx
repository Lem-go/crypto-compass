import Header from "@/components/Header";
import MarketTicker from "@/components/MarketTicker";
import MarketStats from "@/components/MarketStats";
import BtcPriceChart from "@/components/BtcPriceChart";
import SentimentGauge from "@/components/SentimentGauge";
import DominanceChart from "@/components/DominanceChart";
import CoinTable from "@/components/CoinTable";
import CryptoConverter from "@/components/CryptoConverter";
import NewsFeed from "@/components/NewsFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MarketTicker />

      {/* Hero + Stats */}
      <section id="stats" className="container mx-auto px-4 pt-10 pb-6 scroll-mt-20">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            مرحباً بك في <span className="text-gradient-primary">CryptoLens</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            تابع مشاعر السوق، أسعار العملات الرقمية، وأحدث البيانات في مكان واحد.
          </p>
        </div>
        <MarketStats />
      </section>

      {/* BTC Chart */}
      <section className="container mx-auto px-4 pb-6">
        <BtcPriceChart />
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          <div id="coins" className="lg:col-span-2 space-y-6 scroll-mt-20">
            <CoinTable />
          </div>
          <div className="space-y-6">
            <div id="sentiment" className="scroll-mt-20">
              <SentimentGauge />
            </div>
            <div>
              <DominanceChart />
            </div>
            <div id="converter" className="scroll-mt-20">
              <CryptoConverter />
            </div>
            <div id="movers" className="scroll-mt-20">
              <NewsFeed />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="text-sm font-bold">CryptoLens</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              البيانات من CoinGecko و Alternative.me — يتم تحديثها تلقائياً • CryptoLens © 2026
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">CoinGecko</a>
              <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Fear & Greed</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
