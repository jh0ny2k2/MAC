import React from 'react';
import { Search, Heart, Globe, Lock, X } from 'lucide-react';
import { useLanguageStore } from '@/store/language';

export interface FilterState {
  search: string;
  visibility: 'all' | 'private' | 'public_link' | 'circle';
  showFavorites: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export default function FilterBar({ filters, onFiltersChange, totalCount, filteredCount }: FilterBarProps) {
  const { t } = useLanguageStore();

  const handleVisibilityChange = (val: FilterState['visibility']) => onFiltersChange({ ...filters, visibility: val });
  const toggleFavorites = () => onFiltersChange({ ...filters, showFavorites: !filters.showFavorites });

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      visibility: 'all',
      showFavorites: false
    });
  };

  const hasActiveFilters = filters.search || filters.visibility !== 'all' || filters.showFavorites;

  const chipClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
      active
        ? 'bg-foreground text-background shadow-md'
        : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
    }`;

  return (
    <div className="mb-10">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 pointer-events-none" />
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-secondary/40 border border-border/40 text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
        />
        {filters.search && (
          <button
            onClick={clearFilters}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => handleVisibilityChange('all')}
          className={chipClass(filters.visibility === 'all')}
        >
          {t('all_memories')}
        </button>
        <button
          onClick={() => handleVisibilityChange('private')}
          className={chipClass(filters.visibility === 'private')}
        >
          <Lock className="w-3.5 h-3.5" />
          {t('private')}
        </button>
        <button
          onClick={() => handleVisibilityChange('public_link')}
          className={chipClass(filters.visibility === 'public_link')}
        >
          <Globe className="w-3.5 h-3.5" />
          {t('public')}
        </button>
        <button
          onClick={toggleFavorites}
          className={chipClass(filters.showFavorites)}
        >
          <Heart className="w-3.5 h-3.5" fill={filters.showFavorites ? "currentColor" : "none"} />
          {t('only_favorites')}
        </button>
      </div>

      {/* Results */}
      <div className="mt-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredCount}</strong> of {totalCount}
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-foreground font-semibold hover:underline underline-offset-4 transition-all"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
