import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2, Image as ImageIcon, MapPin, Lock, Globe, X, ArrowLeft, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useLanguageStore } from '@/store/language';

export default function CreateMemory() {
  const navigate = useNavigate();
  const { user, session } = useAuthStore();
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'private',
    location: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("No active session. Please log in again.");
      navigate('/login');
      return;
    }

    const userId = user?.id || session.user.id;
    if (!userId) return;
    
    setLoading(true);

    try {
      const insertData: any = {
        user_id: userId,
        title: formData.title,
        content: formData.content,
        status: formData.status,
      };

      if (formData.location) {
        insertData.location = formData.location;
      }

      const { data: memoryData, error } = await supabase
        .from('memories')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      
      if (selectedFile && memoryData) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${userId}/${memoryData.id}/${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('memories')
          .upload(filePath, selectedFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('memories')
            .getPublicUrl(filePath);

          await supabase
            .from('memory_media')
            .insert([{
              memory_id: memoryData.id,
              file_url: publicUrl,
              file_type: 'image',
              storage_path: filePath
            }]);
        }
      }

      navigate('/app');
    } catch (error: any) {
      console.error('Error creating memory:', error);
      alert('Error creating memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-40 animate-in fade-in duration-500">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate('/app')}
            className="h-10 w-10 -ml-2 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={t('back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t('new_memory')}
          </span>

          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title}
            data-tour="album-publish"
            className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('publish')}
          </button>
        </div>

        {/* Cover - discreet */}
        <div
          className="mb-8"
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative rounded-2xl overflow-hidden">
              <img src={previewUrl} alt="Cover" className="w-full h-44 object-cover" />
              <button
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors"
                title={t('remove')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              className={`flex items-center justify-center gap-2 h-14 rounded-2xl border border-dashed border-border bg-secondary/20 cursor-pointer text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm font-medium ${
                isDragOver ? 'border-foreground bg-primary/5' : ''
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              {t('add_cover_image')}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder={t('title_placeholder')}
          data-tour="album-title"
          className="w-full bg-transparent text-3xl sm:text-4xl font-bold placeholder-muted-foreground/30 border-none focus:ring-0 p-0 leading-tight mb-6"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          autoFocus
        />

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 text-sm">
          <div className="flex items-center gap-2 bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full text-muted-foreground transition-colors focus-within:ring-1 focus-within:ring-border">
            <MapPin className="w-3.5 h-3.5" />
            <input
              type="text"
              placeholder={t('add_location')}
              className="bg-transparent border-none focus:ring-0 p-0 w-32 placeholder-muted-foreground/50 text-foreground text-sm"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="flex bg-secondary/60 rounded-full p-0.5 border border-transparent hover:border-border transition-colors">
            <button
              onClick={() => setFormData({ ...formData, status: 'private' })}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                formData.status === 'private' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Lock className="w-3 h-3" /> {t('private')}
            </button>
            <button
              onClick={() => setFormData({ ...formData, status: 'public_link' })}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                formData.status === 'public_link' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="w-3 h-3" /> {t('public')}
            </button>
          </div>

          <div className="ml-auto text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

        {/* Story */}
        <textarea
          placeholder={t('story_placeholder')}
          className="w-full min-h-[320px] bg-transparent text-[15px] leading-relaxed text-foreground placeholder-muted-foreground/40 border-none focus:ring-0 p-0 resize-none"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
      </div>
    </div>
  );
}
