import Header from "@/components/Header";
import MarketStats from "@/components/MarketStats";
import SentimentGauge from "@/components/SentimentGauge";
import CoinTable from "@/components/CoinTable";
import NewsFeed from "@/components/NewsFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero + Stats */}
      <section id="stats" className="container mx-auto px-4 pt-10 pb-6 scroll-mt-20">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            مرحباً بك في <span className="text-gradient-primary">CryptoLens</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            تابع مشاعر السوق، أسعار العملات الرقمية، وأحدث الأخبار في مكان واحد.
          </p>
        </div>
        <MarketStats />
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
            <div id="movers" className="scroll-mt-20">
              <NewsFeed />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>CryptoLens © 2026 — منصة تحليل مشاعر سوق الكريبتو</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
