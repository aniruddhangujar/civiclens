import React from 'react';
import { useCivicLens } from '../../context/CivicLensContext';

export const NotificationToast = () => {
  const { notifications, removeNotification } = useCivicLens();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto bg-surface-container-lowest border-l-4 border-primary shadow-modal rounded-xl p-3.5 border border-border-subtle animate-in slide-in-from-right-5 fade-in duration-200"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start space-x-2">
              <span className={`material-symbols-outlined text-lg ${
                n.type === 'success' ? 'text-success-green' : n.type === 'error' ? 'text-critical-red' : 'text-primary'
              }`}>
                {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'error' : 'info'}
              </span>
              <div>
                <h4 className="text-label-md font-bold text-on-surface">{n.title}</h4>
                <p className="text-body-md text-xs text-on-surface-variant mt-0.5">{n.message}</p>
                {n.action && (
                  <button
                    onClick={() => {
                      n.action.action();
                      removeNotification(n.id);
                    }}
                    className="mt-2 text-label-sm font-semibold text-primary hover:underline flex items-center gap-1 bg-primary-fixed/50 px-2 py-1 rounded"
                  >
                    <span>{n.action.label}</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-outline hover:text-on-surface p-1 rounded-md"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
