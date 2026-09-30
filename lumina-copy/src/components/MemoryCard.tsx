import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Lock, Globe, Trash2, Users, Image as ImageIcon } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  content: string;
  created_at: string;
  location?: string;
  status: 'private' | 'public_link' | 'circle';
  memory_media?: { file_url: string; file_type: string }[];
  memory_tags?: { tags: { name: string } }[];
}

interface MemoryCardProps {
  memory: Memory;
  onDelete?: (id: string) => void;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  index?: number; 
}

export default function MemoryCard({ memory, onDelete, onFavorite, isFavorite, index = 0 }: MemoryCardProps) {
  const hasMedia = memory.memory_media && memory.memory_media.length > 0;
  const coverImage = hasMedia ? memory.memory_media![0].file_url : null;
  const animationDelay = `${index * 50}ms`;
  const tags = (memory.memory_tags || []).map(tt => tt.tags?.name).filter(Boolean) as string[];

  const statusIcon = memory.status === 'private' ? (
    <Lock className="w-3 h-3 shrink-0" />
  ) : memory.status === 'public_link' ? (
    <Globe className="w-3 h-3 shrink-0" />
  ) : (
    <Users className="w-3 h-3 shrink-0" />
  );

  return (
    <div
      className="group flex flex-col break-inside-avoid mb-6"
      style={{ animationDelay }}
    >
      {/* Photo */}
      <Link
        to={`/app/memories/${memory.id}`}
        className="block relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-secondary/20"
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/40 via-secondary/20 to-transparent">
            <ImageIcon className="w-12 h-12 text-muted-foreground/25" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {memory.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0 -mr-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onFavorite) onFavorite(memory.id);
              }}
              aria-label="Favorite"
              className={`p-1.5 rounded-full transition-all duration-200 active:scale-90 ${
                isFavorite ? 'text-red-500' : 'text-muted-foreground/60 hover:text-foreground'
              }`}
            >
              <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(memory.id);
                }}
                aria-label="Delete"
                className="p-1.5 rounded-full text-muted-foreground/60 transition-all duration-200 active:scale-90 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 truncate">
          {statusIcon}
          <span className="truncate">
            {new Date(memory.created_at).toLocaleDateString()}
            {memory.location && ` · ${memory.location}`}
          </span>
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
