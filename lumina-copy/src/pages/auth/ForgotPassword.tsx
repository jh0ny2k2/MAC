import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useLanguageStore } from '@/store/language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { t } = useLanguageStore();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // This will send an email with a link to /reset-password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: t('forgot_success') });
    }
    setLoading(false);
  };

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
            {t('forgot_title')}
          </h2>
          <p className="text-[15px] text-muted-foreground">
            {t('forgot_sub')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-8">
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
              className="w-full bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground/50 text-base pb-3 pl-8 pr-4 focus:outline-none focus:ring-0 focus:border-foreground transition-colors"
            />
          </div>

          {message && (
            <div className={`text-sm text-center font-medium py-3 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium text-base flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all duration-150"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t('send_reset_link')}
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
      </div>
    </div>
  );
}
