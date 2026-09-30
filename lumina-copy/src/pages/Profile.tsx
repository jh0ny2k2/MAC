import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, User, AtSign, Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useLanguageStore } from '@/store/language';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, setProfile } = useAuthStore();
  const { t } = useLanguageStore();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const usernameVal = username.trim();
    if (!usernameVal) {
      setError(t('username_required'));
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(usernameVal)) {
      setError(t('username_invalid'));
      return;
    }

    setLoading(true);
    setError(null);
    setSaved(false);

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ username: usernameVal, full_name: fullName.trim() || null })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      setError(updateError.code === '23505' ? t('username_taken') : updateError.message);
      setLoading(false);
      return;
    }

    setProfile(data);
    setLoading(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    "w-full bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground/50 text-base pb-3 pl-9 pr-10 focus:outline-none focus:ring-0 focus:border-foreground transition-colors";

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-background px-6 py-8">
      <div className="w-full max-w-sm space-y-7">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-foreground font-black text-2xl border border-border shadow-sm">
            {(user?.username || user?.email || 'U')[0].toUpperCase()}
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-medium tracking-tight text-foreground">
            {t('profile_title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('profile_subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-6">
            <div className="relative">
              <User className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
              <input
                id="profile-full-name"
                name="fullName"
                type="text"
                placeholder={t('full_name_label')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <AtSign className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
              <input
                id="profile-username"
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
              <User className="absolute left-0 top-3 h-4 w-4 text-muted-foreground/60" />
              <input
                id="profile-email"
                name="email"
                type="email"
                disabled
                value={user?.email || ''}
                className={`${inputClass} opacity-60 cursor-not-allowed`}
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
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : saved ? (
              <>
                <Check className="h-5 w-5" /> {t('saved')}
              </>
            ) : (
              t('save_changes')
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/app" className="font-semibold text-foreground hover:underline underline-offset-4">
            {t('back')}
          </Link>{' '}
          · {user?.email}
        </p>
      </div>
    </div>
  );
}
