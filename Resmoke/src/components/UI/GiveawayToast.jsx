import React, { useEffect, useState } from "react";

const GiveawayToast = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("inviteToastClosed");
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    try {
      sessionStorage.setItem("inviteToastClosed", "true");
    } catch (_) {}
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
        <div
          className="p-3"
          style={{ width: "min(90vw, 18rem)" }}
          role="dialog"
          aria-label="Gana puntos invitando"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Gana puntos invitando</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">10 por referidos, 5 por canje</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <a
              href="/profile?tutorial=invite"
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
            >
              Ver cómo funciona <span aria-hidden>↗</span>
            </a>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Max 2 canjes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveawayToast;