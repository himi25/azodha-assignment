/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

type SnackbarType = 'success' | 'error' | 'neutral';

interface SnackbarState {
    message: string;
    type: SnackbarType;
    isVisible: boolean;
}

interface SnackbarContextValue {
    show: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error('useSnackbar must be used within SnackbarProvider');
    return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<SnackbarState>({
        message: '',
        type: 'neutral',
        isVisible: false,
    });

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = useCallback((message: string, type: SnackbarType = 'neutral') => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setState({ message, type, isVisible: true });
        
        timerRef.current = setTimeout(() => {
            setState((prev) => ({ ...prev, isVisible: false }));
        }, 3000);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const accentGradient =
        state.type === 'success'
            ? 'linear-gradient(180deg, #14b8a6, #10b981)'
            : state.type === 'error'
                ? 'linear-gradient(180deg, #ef4444, #ec4899)'
                : 'linear-gradient(180deg, #3b8bdc, #2d6fb8)';

    return (
        <SnackbarContext.Provider value={{ show }}>
            {children}

            <div
                className={`
                    fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                    transition-all duration-300
                    ${state.isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-3 pointer-events-none'
                    }
                `}
                style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
            >
                <div
                    className="flex items-center gap-3 px-5 py-3 rounded-xl"
                    style={{
                        background: 'rgba(20, 26, 46, 0.85)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: '0 16px 48px -8px rgba(0, 0, 0, 0.5)',
                        borderLeft: '3px solid transparent',
                        borderImage: `${accentGradient} 1`,
                    }}
                >
                    {state.type === 'success' && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-success)' }}>
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    {state.type === 'error' && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-danger)' }}>
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                    {state.type === 'neutral' && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-button)' }}>
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {state.message}
                    </span>
                </div>
            </div>
        </SnackbarContext.Provider>
    );
};
