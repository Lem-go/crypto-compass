import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button
      onClick={toggleLanguage}
      className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
      title={i18n.language === 'ar' ? 'English' : 'العربية'}
    >
      <Globe className="w-4 h-4 text-muted-foreground" />
      <span className="ml-1 text-xs font-medium">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
    </button>
  );
};

export default LanguageSwitcher;
