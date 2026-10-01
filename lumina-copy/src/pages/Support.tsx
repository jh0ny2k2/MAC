import React, { useState } from 'react';
import { useLanguageStore } from '@/store/language';
import { useAuthStore } from '@/store/auth';
import { ChevronDown, Send, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Support() {
  const { t } = useLanguageStore();
  const { session } = useAuthStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Contact Form State
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const faqs = [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // The Resend delivery channel was removed; no backend endpoint is configured.
    // Keep the form visible but do not pretend the message was delivered.
    alert('Email support is temporarily unavailable. Please reach us directly.');
    setSending(false);
    setSent(false);
  };

  const fieldClass =
    "w-full bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground/50 text-base pt-1 pb-3 focus:outline-none focus:ring-0 focus:border-foreground transition-colors";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SEO
        title={`${t('support_title')} | Keptra Support`}
        description={t('support_subtitle')}
      />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 pt-[calc(env(safe-area-inset-top)+2rem)]">
        <Link to="/">
          <img src="/LogoNegro.png" alt="Keptra" className="h-7 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {session ? (
            <Link
              to="/app"
              className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
            >
              {t('dashboard_title')}
            </Link>
          ) : (
            <Link
              to="/login"
              className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center px-6 pt-16 pb-24">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
              {t('support_title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('support_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-14">
            {/* FAQs */}
            <div>
              <h2 className="text-xl font-semibold mb-6">{t('faq_title')}</h2>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-border rounded-2xl bg-card overflow-hidden transition-colors">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left font-medium hover:bg-secondary/50 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 pt-0 text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-semibold mb-6">{t('contact_title')}</h2>

              {sent ? (
                <div className="border border-border rounded-3xl bg-card p-10 text-center space-y-3">
                  <h3 className="text-2xl font-semibold tracking-tight">{t('message_sent')}</h3>
                  <p className="text-muted-foreground">{t('message_sent_desc')}</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-sm font-semibold underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    {t('send_another')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-7">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {t('label_name')}
                      </label>
                      <input
                        type="text"
                        required
                        className={fieldClass}
                        placeholder={t('label_name')}
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {t('label_email')}
                      </label>
                      <input
                        type="email"
                        required
                        className={fieldClass}
                        placeholder={t('label_email')}
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {t('label_message')}
                      </label>
                      <textarea
                        required
                        rows={4}
                        className={fieldClass}
                        placeholder={t('leave_message')}
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium text-base flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all duration-150"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {t('btn_send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
