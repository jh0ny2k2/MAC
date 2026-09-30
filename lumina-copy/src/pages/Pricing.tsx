import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/language';
import { useAuthStore } from '@/store/auth';
import SEO from '@/components/SEO';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Pricing() {
  const { t } = useLanguageStore();
  const { session } = useAuthStore();

  const plans = [
    {
      name: t('plan_free_title'),
      price: t('plan_free_price'),
      desc: t('plan_free_desc'),
      features: [t('feature_1_album'), t('feature_50_photos'), t('feature_quality')],
      cta: t('btn_start_free'),
      featured: false,
      href: '/signup',
      external: false,
    },
    {
      name: t('plan_basic_title'),
      price: t('plan_basic_price'),
      desc: t('plan_basic_desc'),
      features: [t('feature_1_album'), t('feature_2000_photos'), t('feature_quality'), t('lifetime_access')],
      cta: t('btn_get_basic'),
      featured: false,
      href: 'https://luminamemories.lemonsqueezy.com/checkout/buy/85e82934-870a-40f3-97d5-53a6835791ad',
      external: true,
    },
    {
      name: t('plan_pro_title'),
      price: t('plan_pro_price'),
      desc: t('plan_pro_desc'),
      features: [t('feature_unlimited_albums'), t('feature_2000_photos'), t('feature_slideshow'), t('feature_zip'), t('priority_support')],
      cta: t('btn_get_pro'),
      featured: true,
      href: 'https://luminamemories.lemonsqueezy.com/checkout/buy/2b39a6b5-1670-41ed-a3e6-dafd4fbc48cd',
      external: true,
    },
    {
      name: t('plan_unlimited_title'),
      price: t('plan_unlimited_price'),
      desc: t('plan_unlimited_desc'),
      features: [t('feature_unlimited_albums'), t('feature_unlimited'), t('feature_quality'), t('vip_support'), t('lifetime_access')],
      cta: t('btn_get_unlimited'),
      featured: false,
      href: 'https://luminamemories.lemonsqueezy.com/checkout/buy/840e6a26-6867-4524-a52e-92e5bb51b979',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SEO
        title={`Keptra Pricing | ${t('pricing_title')}`}
        description={t('pricing_subtitle')}
      />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 pt-[calc(env(safe-area-inset-top)+2rem)]">
        <Link to="/">
          <img src="/LogoNegro.png" alt="Keptra" className="h-7 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {session ? (
            <Link
              to="/app"
              className="flex items-center gap-1.5 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t('dashboard_title')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                to="/signup"
                className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
              >
                {t('signup')}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center px-6 pt-20 pb-24">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
              {t('pricing_title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('pricing_subtitle')}
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl px-7 py-8 border transition-colors duration-200 ${
                  plan.featured
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 -mt-3 mr-6 bg-primary-foreground text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {t('most_popular')}
                  </div>
                )}

                <h3 className="text-base font-semibold mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span className={`text-xs font-medium ${plan.featured ? 'text-primary-foreground/50' : 'text-muted-foreground'}`}>
                    {plan.price !== t('plan_free_price') && `/ ${t('one_time_payment')}`}
                  </span>
                </div>
                <p className={`text-sm mb-8 ${plan.featured ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                  {plan.desc}
                </p>

                <ul className="space-y-3 mb-10 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className={`shrink-0 mt-0.5 rounded-full p-0.5 ${plan.featured ? 'bg-primary-foreground/15' : 'bg-secondary'}`}>
                        <Check className={`w-3.5 h-3.5 ${plan.featured ? 'text-primary-foreground' : 'text-foreground'}`} />
                      </span>
                      <span className={plan.featured ? 'text-primary-foreground/85' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.external ? (
                  <a
                    href={plan.href}
                    className={`h-12 rounded-full font-medium text-base flex items-center justify-center transition-all duration-150 ${
                      plan.featured
                        ? 'bg-primary-foreground text-primary hover:opacity-90'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    to={plan.href}
                    className="h-12 rounded-full font-medium text-base flex items-center justify-center border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-150"
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>

          {/* Footer note */}
          <p className="mt-20 text-center text-sm text-muted-foreground">
            {t('secure_payment')}
          </p>
        </div>
      </div>
    </div>
  );
}
