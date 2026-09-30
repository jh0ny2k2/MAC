import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useLanguageStore } from '@/store/language';
import { useAuthStore } from '@/store/auth';
import SEO from '@/components/SEO';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2068&auto=format&fit=crop';

export default function Home() {
  const { t } = useLanguageStore();
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative flex flex-col overflow-hidden selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={t('hero_title_1') + " " + t('hero_title_2')}
        description={t('hero_subtitle')}
      />

      {/* Full-bleed hero image */}
      <div className="absolute inset-0" aria-hidden="true">
        <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/90" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <div className="bg-white rounded-xl shadow-lg shadow-black/30 p-1.5">
          <img
            src="/LogoNegro.png"
            alt="Keptra"
            className="h-8 w-8 object-contain"
          />
        </div>
        <LanguageSwitcher />
      </header>

      {/* Bottom content over image */}
      <main className="relative z-10 mt-auto px-6 pt-40 pb-[calc(env(safe-area-inset-bottom)+2.75rem)]">
        <div className="max-w-md mx-auto space-y-9">
          {/* Brand */}
          <div className="space-y-3.5">
            <div className="inline-flex bg-white rounded-2xl shadow-xl shadow-black/30 p-2">
              <img
                src="/LogoNegro.png"
                alt="Keptra"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-white/80 text-[15px] font-light leading-relaxed max-w-sm">
              {t('hero_subtitle')}
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Link
              to="/signup"
              className="w-full h-14 rounded-2xl bg-white text-black font-bold text-base flex items-center justify-center shadow-2xl shadow-black/30 active:scale-[0.98] transition-all duration-150"
            >
              {t('hero_cta_primary')}
            </Link>
            <Link
              to="/login"
              className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold text-base flex items-center justify-center active:scale-[0.98] hover:bg-white/20 transition-all duration-150"
            >
              {t('login')}
            </Link>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-3 text-xs text-white/60">
            <Link to="/pricing" className="hover:text-white transition-colors">{t('pricing')}</Link>
            <span aria-hidden="true">·</span>
            <Link to="/support" className="hover:text-white transition-colors">FAQs</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
