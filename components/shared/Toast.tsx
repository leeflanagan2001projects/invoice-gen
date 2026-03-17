'use client';
import { useUIStore } from '@/store/uiStore';

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
            text-white font-medium text-sm cursor-pointer
            animate-[slideUp_0.2s_ease-out]
            ${toast.type === 'success' ? 'bg-success' : ''}
            ${toast.type === 'error' ? 'bg-danger' : ''}
            ${toast.type === 'info' ? 'bg-primary' : ''}
          `}
        >
          {toast.type === 'success' && <span>✓</span>}
          {toast.type === 'error' && <span>✕</span>}
          {toast.type === 'info' && <span>ℹ</span>}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
