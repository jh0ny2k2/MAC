import React, { useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Plus, Sparkles, Images, Image as ImageIcon, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useLanguageStore } from '@/store/language';
import { useTutorialStore } from '@/store/tutorial';
import MemoryGrid from '@/components/MemoryGrid';
import SEO from '@/components/SEO';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const queryClient = useQueryClient();
  const setTutorialOpen = useTutorialStore((state) => state.setOpen);

  useEffect(() => {
    if (!user?.id) return;
    const seenKey = `keptra:onboarding:${user.id}`;
    if (!localStorage.getItem(seenKey)) {
      localStorage.setItem(seenKey, 'true');
      setTutorialOpen(true);
    }
  }, [user?.id, setTutorialOpen]);

  const { data: memories, isLoading, error } = useQuery({
    queryKey: ['memories', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('memories')
        .select(`
          id,
          title,
          content,
          status,
          location,
          created_at,
          user_id,
          profiles:user_id (
            username,
            avatar_url
          ),
          memory_tags (
            tags (
              name
            )
          ),
          memory_media:memory_media!memory_media_memory_id_fkey (
            file_url,
            file_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('memories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  // Derived stats
  const stats = useMemo(() => {
    if (!memories) return { total: 0, favorites: 0, shared: 0, photos: 0 };
    return {
      total: memories.length,
      shared: memories.filter(m => m.status !== 'private').length,
      photos: memories.reduce((acc, m) => acc + (m.memory_media?.length || 0), 0)
    };
  }, [memories]);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('plan_tier').eq('id', user?.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const plan = profile?.plan_tier || 'free';
  
  // Logic for Album Limit
  // Free & Basic: 1 Album Limit
  // Pro & Unlimited: Unlimited Albums
  const albumLimit = (plan === 'free' || plan === 'basic') ? 1 : Infinity;
  const hasReachedLimit = stats.total >= albumLimit; 

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
        <div className="bg-destructive/5 p-6 rounded-3xl mb-6 border border-destructive/10">
            <Sparkles className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-2xl font-bold text-foreground tracking-tight">Something went wrong</h3>
        <p className="text-muted-foreground max-w-md mt-2 mb-8">{(error as any).message}</p>
        <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['memories'] })}
            className="px-6 py-2 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
        >
            Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 max-w-7xl mx-auto px-4 sm:px-6">
      <SEO 
        title={t('dashboard_title')} 
        description="Your personal memory dashboard." 
      />
      {/* Header */}
      <div className="pt-4 pb-6 border-b border-border/20">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
              {t('dashboard_title')}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base font-light tracking-wide">
              {t('dashboard_subtitle')}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="shrink-0">
                {plan === 'unlimited' ? (
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 text-yellow-900 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 border border-yellow-300 whitespace-nowrap">
                        Unlimited
                    </div>
                ) : plan === 'pro' ? (
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-200 via-rose-400 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 border border-rose-300 whitespace-nowrap">
                        Pro Member
                    </div>
                ) : plan === 'basic' ? (
                    <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200 whitespace-nowrap">
                        Basic Plan
                    </div>
                ) : (
                    <div className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-widest border border-border whitespace-nowrap">
                        Free Plan
                    </div>
                )}
            </div>
            {hasReachedLimit ? (
                <Link
                    to="/pricing"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-rose-500 rounded-full hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 group"
                >
                    <Sparkles className="w-4 h-4" />
                    Upgrade
                </Link>
            ) : (
                <Link
                    to="/app/memories/new"
                    data-tour="create-album"
                    className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-background bg-foreground rounded-full hover:opacity-90 transition-all shadow-lg group"
                >
                    <Plus className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform" />
                    {t('dashboard_create')}
                </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-2xl bg-secondary/40 border border-border/40 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black leading-none">{stats.total}</span>
              <Images className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-2">
              {t('stats_memories')}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/40 border border-border/40 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black leading-none">{stats.photos}</span>
              <ImageIcon className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-2">
              {t('stats_photos')}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/40 border border-border/40 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black leading-none">{stats.shared}</span>
              <Globe className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-2">
              {t('stats_shared')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700">
         <MemoryGrid 
            memories={memories || []} 
            isLoading={isLoading} 
            onDelete={(id) => deleteMutation.mutate(id)}
         />
      </div>
    </div>
  );
}
