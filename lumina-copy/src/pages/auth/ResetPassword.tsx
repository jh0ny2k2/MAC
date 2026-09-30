import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, MailX } from 'lucide-react';
import { useLanguageStore } from '@/store/language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguageStore();

  useEffect(() => {
    let cancelled = false;
    let timeout: number;

    const handleSession = (session: unknown) => {
      if (session && !cancelled) {
        setHasSession(true);
        setChecking(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        handleSession(session);
      }
    });

    supabase.auth.getSession().then(({ data }) => handleSession(data.session));

    timeout = window.setTimeout(() => {
      if (!cancelled) setChecking(false);
    }, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t('password_min'));
      return;
    }
    if (password !== confirm) {
      setError(t('passwords_mismatch'));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setUpdated(true);
    setLoading(false);
    window.setTimeout(() => navigate('/app'), 1500);
  };

  const inputClass =
    "w-full bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground/50 text-base pb-3 pl-8 pr-10 focus:outline-none focus:ring-0 focus:border-foreground transition-colors";

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
      {/* Language Switcher */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+1.5rem)] right-6 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <img src="/LogoNegro.png" alt="Keptra" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        {!hasSession ? (
          <>
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
                  <MailX className="h-6 w-6" />
                </div>
              </div>
              <h2 className="text-4xl font-medium tracking-tight text-foreground">
                {t('link_invalid')}
              </h2>
              <p className="text-[15px] text-muted-foreground">
                {t('forgot_sub')}
              </p>
            </div>

            {/* Footer */}
            <div className="space-y-4">
              <Link
                to="/forgot-password"
                className="block w-full h-12 rounded-full bg-primary text-primary-foreground font-medium text-base flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.99] transition-all duration-150"
              >
                {t('request_new_link')}
              </Link>
              <p className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('back_to_login')}
                </Link>
              </p>
            </div>
          </>
        ) : updated ? (
          <>
            {/* Success */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="h-14 w-14 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
              <h2 className="text-4xl font-medium tracking-tight text-foreground">
                {t('password_updated')}
              </h2>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-medium tracking-tight text-foreground">
                {t('forgot_title')}
              </h2>
              <p className="text-[15px] text-muted-foreground">
                {t('forgot_sub')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="space-y-7">
                <div className="relative">
                  <Lock className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
                  <input
                    id="new-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder={t('new_password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-0 top-2.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder={t('confirm_password')}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm font-medium text-destructive text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium text-base flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all duration-150"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t('update_password')}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('back_to_login')}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
