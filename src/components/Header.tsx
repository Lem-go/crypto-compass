import { Search, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Crypto<span className="text-gradient-primary">Lens</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">لوحة التحكم</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">المحفظة</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">الأخبار</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">التنبيهات</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary animate-pulse-glow" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
