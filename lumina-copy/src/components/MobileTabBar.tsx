import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LogOut, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useLanguageStore } from '@/store/language';
import { cn } from '@/lib/utils';

export default function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);
  const { t } = useLanguageStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isFeedActive = location.pathname === '/app';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-background/95 backdrop-blur-xl border-t border-border">
      <div className="grid grid-cols-3 items-end h-[calc(4rem+env(safe-area-inset-bottom))] px-4 pb-[env(safe-area-inset-bottom)]">
        <Link
          to="/app"
          className="flex flex-col items-center justify-center gap-1 py-1 min-h-11"
        >
          <span
            className={cn(
              'p-1.5 rounded-xl transition-colors',
              isFeedActive ? 'text-foreground bg-secondary' : 'text-muted-foreground'
            )}
          >
            <Home className="w-6 h-6" />
          </span>
          <span className="text-[10px] font-bold tracking-wide text-muted-foreground">
            {t('feed')}
          </span>
        </Link>

        <Link
          to="/app/memories/new"
          data-tour="create-album"
          className="flex flex-col items-center justify-center -mt-6"
        >
          <span className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl shadow-foreground/25 active:scale-95 transition-transform">
            <Plus className="w-7 h-7" />
          </span>
          <span className="text-[10px] font-bold tracking-wide text-muted-foreground mt-1">
            {t('new_memory')}
          </span>
        </Link>

        <button
          onClick={handleSignOut}
          className="flex flex-col items-center justify-center gap-1 py-1 min-h-11"
        >
          <span className="p-1.5 rounded-xl text-muted-foreground transition-colors">
            <LogOut className="w-6 h-6" />
          </span>
          <span className="text-[10px] font-bold tracking-wide text-muted-foreground">
            {t('sign_out')}
          </span>
        </button>
      </div>
    </nav>
  );
}
