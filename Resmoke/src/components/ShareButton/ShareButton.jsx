import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Facebook, Twitter, Link as LinkIcon, MessageCircle, Check, Share2 } from 'lucide-react';

const WEB_SHARE_API_SUPPORTED = typeof navigator !== 'undefined' && 'share' in navigator;

const ShareButton = ({ url, title, description, contentType, contentId, className = '', variant = 'icon', onShare }) => {
  const [copyOk, setCopyOk] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? url || window.location.href : url;
  const shareTitle = title || (typeof document !== 'undefined' ? document.title : '');
  const shareText = description || '';

  const handleTrack = (platform) => {
    if (onShare) {
      onShare(platform, { contentType, contentId });
    }
  };

  const handleWebShare = async () => {
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      handleTrack('native');
    } catch (err) {
      if (err.name !== 'AbortError') {
        setShowOptions(true);
      }
    }
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}${shareText ? ` - ${shareText}` : ''}\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener');
    handleTrack('whatsapp');
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener');
    handleTrack('facebook');
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'noopener');
    handleTrack('twitter');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyOk(true);
      handleTrack('copy');
      setTimeout(() => setCopyOk(false), 2000);
    } catch {}
  };

  const buttonClass = `w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 hover:text-gray-900 flex items-center justify-center transition-all text-gray-500 ${className}`;

  if (variant === 'button') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleShareWhatsApp} type="button" aria-label="WhatsApp" className={buttonClass}>
          <MessageCircle className="w-4 h-4" />
        </button>
        <button onClick={handleShareFacebook} type="button" aria-label="Facebook" className={buttonClass}>
          <Facebook className="w-4 h-4" />
        </button>
        <button onClick={handleShareTwitter} type="button" aria-label="Twitter" className={buttonClass}>
          <Twitter className="w-4 h-4" />
        </button>
        <button onClick={handleCopyLink} type="button" aria-label="Copiar enlace"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            copyOk ? 'bg-green-100 text-green-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900'
          }`}>
          {copyOk ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  if (WEB_SHARE_API_SUPPORTED) {
    return (
      <button onClick={handleWebShare} type="button" aria-label="Compartir" className={buttonClass}>
        <Share2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setShowOptions(!showOptions)} type="button" aria-label="Compartir" className={buttonClass}>
        <Share2 className="w-4 h-4" />
      </button>
      {showOptions && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-lg border border-gray-100 p-3 min-w-[200px]">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-2 px-1">Compartir en</p>
            <div className="space-y-1">
              <button onClick={handleShareWhatsApp} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp
              </button>
              <button onClick={handleShareFacebook} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                <Facebook className="w-4 h-4 text-blue-600" /> Facebook
              </button>
              <button onClick={handleShareTwitter} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                <Twitter className="w-4 h-4 text-sky-500" /> Twitter
              </button>
              <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                {copyOk ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4 text-gray-500" />}
                {copyOk ? '¡Enlace copiado!' : 'Copiar enlace'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

ShareButton.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  contentType: PropTypes.string,
  contentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  variant: PropTypes.oneOf(['icon', 'button']),
  onShare: PropTypes.func
};

export default ShareButton;
