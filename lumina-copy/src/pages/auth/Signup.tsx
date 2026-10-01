import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { signInWithGoogle, isNative } from '@/lib/native';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useLanguageStore } from '@/store/language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguageStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      navigate('/app');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      if (isNative) navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground/50 text-base pb-3 pl-8 pr-10 focus:outline-none focus:ring-0 focus:border-foreground transition-colors";

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

        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-medium tracking-tight text-foreground">
            {t('signup')}
          </h2>
          <p className="text-[15px] text-muted-foreground">
            {t('auth_signup_sub')}
          </p>
        </div>

        {/* Google */}
        <div className="space-y-5">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full h-12 rounded-full border border-border bg-card text-foreground font-medium text-base flex items-center justify-center gap-3 hover:bg-secondary active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all duration-150"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
            )}
            {t('continue_with_google')}
          </button>

          <div className="flex items-center gap-4">
            <span className="flex-1 h-px bg-border" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">{t('or')}</span>
            <span className="flex-1 h-px bg-border" aria-hidden="true" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-8">
          <div className="space-y-7">
            <div className="relative">
              <User className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                placeholder={t('full_name_label')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <User className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder={t('username_label')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t('email_label')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder={t('password_label')}
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
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t('signup')}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          {t('have_account')}{' '}
          <Link to="/login" className="font-semibold text-foreground hover:underline underline-offset-4">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
