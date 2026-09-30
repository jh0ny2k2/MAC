import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Placement = 'top' | 'bottom';

export type SpotlightStep = {
  target?: string;
  title: string;
  desc: string;
  placement?: Placement;
};

type Rect = { top: number; left: number; width: number; height: number };

interface SpotlightTourProps {
  open: boolean;
  steps: SpotlightStep[];
  skipLabel: string;
  nextLabel: string;
  doneLabel: string;
  onClose: () => void;
}

function findVisibleEl(selector: string): HTMLElement | null {
  const els = document.querySelectorAll<HTMLElement>(selector);
  for (const el of els) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return el;
  }
  return null;
}

const TOOLTIP_W = 280;
const TOOLTIP_H = 240;

function getPos(rect: Rect, placement: Placement = 'bottom') {
  const gap = 16;
  const bottom = rect.top + rect.height;
  let left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
  left = Math.max(16, Math.min(left, window.innerWidth - TOOLTIP_W - 16));

  let top = placement === 'top' ? rect.top - gap - TOOLTIP_H : bottom + gap;
  if (top < 16) top = bottom + gap;
  if (top + TOOLTIP_H > window.innerHeight - 16) top = Math.max(16, rect.top - gap - TOOLTIP_H);

  return { top, left };
}

function getFallbackPos() {
  const left = Math.max(16, (window.innerWidth - TOOLTIP_W) / 2);
  return { top: Math.max(16, window.innerHeight - TOOLTIP_H - 24), left };
}

export default function SpotlightTour({ open, steps, skipLabel, nextLabel, doneLabel, onClose }: SpotlightTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);
  const location = useLocation();

  const stepRef = useRef(-1);
  const startPathRef = useRef<string>('');

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const measure = useCallback(() => {
    if (!current?.target) {
      setRect(null);
      setReady(true);
      return;
    }
    const el = findVisibleEl(current.target);
    if (!el) {
      setReady(false);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    setReady(true);
  }, [current?.target]);

  useEffect(() => {
    if (open) {
      setStep(0);
      stepRef.current = -1;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (stepRef.current !== step) {
      stepRef.current = step;
      startPathRef.current = location.pathname;
    }

    setReady(false);
    setRect(null);

    if (current?.target) {
      const el = findVisibleEl(current.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const t = window.setTimeout(measure, 450);

    const iv = window.setInterval(() => {
      if (current?.target) {
        const el = findVisibleEl(current.target);
        if (el) {
          const r = el.getBoundingClientRect();
          setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
          setReady(true);
        } else {
          const next = steps[step + 1];
          if (location.pathname !== startPathRef.current) {
            if (!next?.target || findVisibleEl(next.target)) {
              setStep(step + 1);
            }
          }
        }
      } else {
        setReady(true);
      }
    }, 400);

    return () => {
      window.clearTimeout(t);
      window.clearInterval(iv);
    };
  }, [open, step, location.pathname, current?.target, measure, steps]);

  const goNext = () => {
    if (isLast) {
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {current?.target && (
            <>
              {rect && ready && (
                <>
                  {/* Spotlight hole: darkens everything except the target */}
                  <motion.div
                    key={`hole-${step}`}
                    className="fixed pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      top: rect.top,
                      left: rect.left,
                      width: rect.width,
                      height: rect.height,
                      borderRadius: 16,
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
                    }}
                  />
                  {/* Pulsing ring around the target */}
                  <motion.div
                    className="fixed pointer-events-none border-[3px] border-white/90"
                    style={{
                      top: rect.top - 5,
                      left: rect.left - 5,
                      width: rect.width + 10,
                      height: rect.height + 10,
                      borderRadius: 20,
                    }}
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </>
              )}

              {/* Skip */}
              <button
                onClick={onClose}
                className="fixed top-4 right-4 z-[110] pointer-events-auto text-sm font-bold text-white/80 hover:text-white px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {skipLabel}
              </button>

              {/* Tooltip (always visible; anchored to the target when found, bottom-center otherwise) */}
              <motion.div
                key={`tip-${step}`}
                className="fixed z-[110] pointer-events-auto bg-white rounded-3xl shadow-2xl p-6"
                style={{
                  top: (rect && ready ? getPos(rect, current.placement) : getFallbackPos()).top,
                  left: (rect && ready ? getPos(rect, current.placement) : getFallbackPos()).left,
                  width: TOOLTIP_W,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground tracking-tight leading-snug">
                      {current.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {current.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <div className="flex gap-1.5">
                    {steps.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-300',
                          i === step ? 'w-5 bg-foreground' : 'w-1.5 bg-foreground/20'
                        )}
                      />
                    ))}
                  </div>
                  <button
                    onClick={goNext}
                    className="px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg"
                  >
                    {isLast ? doneLabel : nextLabel}
                  </button>
                </div>
              </motion.div>
            </>
          )}

          {!current?.target && ready && (
            <>
              <div className="fixed inset-0 bg-black/65 backdrop-blur-[2px] pointer-events-none" />
              <motion.div
                key={`final-${step}`}
                className="fixed inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center pointer-events-auto"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                >
                  <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-5">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">{current.title}</h2>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{current.desc}</p>
                  <button
                    onClick={onClose}
                    className="mt-7 w-full px-6 py-3 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg"
                  >
                    {doneLabel}
                  </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
