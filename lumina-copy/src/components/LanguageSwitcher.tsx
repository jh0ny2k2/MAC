import { Globe } from 'lucide-react';
import { useLanguageStore } from '@/store/language';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div
      role="group"
      aria-label="Language"
      className="relative inline-flex items-center rounded-full bg-secondary/70 p-1 border border-border/60 shadow-inner"
    >
      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none z-10" />
      <span
        aria-hidden="true"
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-foreground shadow-md transition-all duration-300 ease-out ${
          language === 'en' ? 'left-1' : 'left-1/2'
        }`}
      />
      <button
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`relative z-10 pl-8 pr-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors duration-300 ${
          language === 'en' ? 'text-background' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        aria-pressed={language === 'es'}
        className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors duration-300 ${
          language === 'es' ? 'text-background' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        ES
      </button>
    </div>
  );
}
