'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  id: string;
  message: ReactNode;
  type: ToastType;
}

interface ToastContextType {
  toast: ToastState | null;
  showToast: (message: ReactNode | null, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (message: ReactNode | null, type: ToastType = 'info') => {
    if (message === null) {
      setToast(null);
      return;
    }
    if (toast?.message === message) {
      return;
    }
    const newToast = {
      id: Math.random().toString(),
      message,
      type
    };
    setToast(newToast);
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
    setTimeout(() => setToast(null), 300);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hideToast, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
      {toast && (
        <div 
          className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ease-in-out transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <div 
            className={`elegant-card ${getBackgroundColor(toast.type)} backdrop-blur-md px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3`}
            style={{ 
              minWidth: '300px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              animation: 'pulseGlow 2s ease-in-out infinite'
            }}
          >
            <div className="flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            <div className="flex-grow font-medium text-white/90">{toast.message}</div>
            <button
              onClick={hideToast}
              className="flex-shrink-0 text-white/70 hover:text-white focus:outline-none transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function getBackgroundColor(type: ToastType): string {
  return {
    success: 'bg-gradient-to-r from-emerald-500/30 to-green-500/30',
    error: 'bg-gradient-to-r from-rose-500/30 to-red-500/30',
    info: 'bg-gradient-to-r from-indigo-500/30 to-blue-500/30'
  }[type];
}

function getIcon(type: ToastType): JSX.Element {
  const iconClasses = {
    success: 'text-emerald-300',
    error: 'text-rose-300',
    info: 'text-indigo-300'
  }[type];

  return {
    success: (
      <div className={`${iconClasses} bg-white/10 p-2 rounded-lg`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className={`${iconClasses} bg-white/10 p-2 rounded-lg`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    info: (
      <div className={`${iconClasses} bg-white/10 p-2 rounded-lg`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    )
  }[type];
}
