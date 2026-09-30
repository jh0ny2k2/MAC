import React, { useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle, LogOut, Home, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useLanguageStore } from '@/store/language';
import { useTutorialStore } from '@/store/tutorial';
import MobileTabBar from '@/components/MobileTabBar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SpotlightTour, { SpotlightStep } from '@/components/SpotlightTour';

export default function Layout() {
  const { user, signOut } = useAuthStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  const location = useLocation();
  const tutorialOpen = useTutorialStore((state) => state.open);
  const setTutorialOpen = useTutorialStore((state) => state.setOpen);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navigation = [
    { name: t('feed'), href: '/app', icon: Home },
    { name: t('new_memory'), href: '/app/memories/new', icon: PlusCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const tourSteps = useMemo<SpotlightStep[]>(
    () => [
      {
        target: '[data-tour="create-album"]',
        placement: 'bottom',
        title: t('tut_0_title'),
        desc: t('tut_0_desc'),
      },
      {
        target: '[data-tour="album-title"]',
        placement: 'bottom',
        title: t('tut_1_title'),
        desc: t('tut_1_desc'),
      },
      {
        target: '[data-tour="album-publish"]',
        placement: 'bottom',
        title: t('tut_2_title'),
        desc: t('tut_2_desc'),
      },
      {
        title: t('tut_3_title'),
        desc: t('tut_3_desc'),
      },
    ],
    [t]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Brand + Desktop Menu */}
            <div className="flex items-center gap-8">
              <Link to="/app" className="flex items-center">
                <img src="/LogoNegro.png" alt="Keptra" className="h-8 w-8 object-contain" />
              </Link>
              <div className="hidden sm:flex sm:items-center sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-200 border-b-2 ${
                      isActive(item.href)
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 mr-2 ${isActive(item.href) ? 'text-foreground' : 'text-muted-foreground'}`} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile: brand + language switcher */}
            <div className="flex items-center sm:hidden gap-3">
                <LanguageSwitcher />
                <Link
                  to="/app/profile"
                  className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-xs border border-border"
                  title={t('profile_title')}
                >
                  {(user?.username || user?.email || 'U')[0].toUpperCase()}
                </Link>
                <button
                  onClick={() => setTutorialOpen(true)}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title={t('tut_reopen')}
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
            </div>
            
            {/* Right Side - Language & Profile */}
            <div className="hidden sm:flex items-center space-x-6 pl-8">
                 {/* Language Switcher */}
                <LanguageSwitcher />

                <button
                  onClick={() => setTutorialOpen(true)}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title={t('tut_reopen')}
                >
                  <HelpCircle className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-4">
                    <Link
                      to="/app/profile"
                      className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-xs border border-border ring-2 ring-background hover:opacity-80 transition-opacity"
                      title={t('profile_title')}
                    >
                      {(user?.username || user?.email || 'U')[0].toUpperCase()}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      title={t('sign_out')}
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
          </div>
        </div>

      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-24 sm:pb-10 md:pb-16">
        <Outlet />
      </main>

      <MobileTabBar />

      <SpotlightTour
        open={tutorialOpen}
        steps={tourSteps}
        skipLabel={t('tut_skip')}
        nextLabel={t('tut_next')}
        doneLabel={t('tut_done')}
        onClose={() => setTutorialOpen(false)}
      />
    </div>
  );
}
