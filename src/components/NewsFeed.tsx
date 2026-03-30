import { Flame, TrendingUp, Zap, AlertTriangle } from "lucide-react";

const news = [
  { title: "البيتكوين يقترب من أعلى مستوى تاريخي جديد", time: "منذ 2 ساعة", icon: TrendingUp, tag: "صعودي" },
  { title: "إيثريوم 2.0 يسجل رقم قياسي في عدد المدققين", time: "منذ 4 ساعات", icon: Zap, tag: "تقني" },
  { title: "تحذير: ارتفاع حاد في رسوم الغاز على الشبكة", time: "منذ 5 ساعات", icon: AlertTriangle, tag: "تحذير" },
  { title: "سولانا تتفوق على إيثريوم في حجم المعاملات اليومية", time: "منذ 7 ساعات", icon: Flame, tag: "رائج" },
];

const tagColors: Record<string, string> = {
  "صعودي": "bg-success/15 text-success",
  "تقني": "bg-primary/15 text-primary",
  "تحذير": "bg-warning/15 text-warning",
  "رائج": "bg-accent/15 text-accent",
};

const NewsFeed = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-1">آخر الأخبار</h3>
      <p className="text-xs text-muted-foreground mb-5">أحدث أخبار سوق العملات الرقمية</p>
      <div className="space-y-4">
        {news.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:glow-primary transition-shadow">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">{item.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tagColors[item.tag]}`}>{item.tag}</span>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
