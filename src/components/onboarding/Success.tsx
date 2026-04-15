import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { completeOnboarding } from '../../features/onboarding/onboardingSlice';
import { useSnackbar } from '../Snackbar';

export const Success = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const hasShownSnackbar = useRef(false);

    useEffect(() => {
        if (!hasShownSnackbar.current) {
            hasShownSnackbar.current = true;
            snackbar.show("Onboarding completed successfully!", "success");
        }

        const timer = setTimeout(() => {
            dispatch(completeOnboarding());
            navigate("/home");
        }, 3000);

        return () => clearTimeout(timer);
    }, [dispatch, navigate, snackbar]);

    return (
        <div className="py-8 text-center">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative zoom-in">
                    <span
                        className="absolute inset-0 rounded-full success-ring"
                        style={{ background: 'var(--gradient-aurora)', opacity: 0.15 }}
                    />
                    <span
                        className="absolute inset-0 rounded-full success-ring-2"
                        style={{ background: 'var(--gradient-aurora)', opacity: 0.1 }}
                    />
                    <span
                        className="absolute inset-0 rounded-full success-ring-3"
                        style={{ background: 'var(--gradient-aurora)', opacity: 0.05 }}
                    />

                    <div
                        className="relative w-24 h-24 rounded-full flex items-center justify-center"
                        style={{
                            background: 'var(--gradient-aurora)',
                            boxShadow: '0 8px 40px -8px rgba(59, 139, 220, 0.4), 0 0 60px -10px rgba(34, 168, 160, 0.25)',
                        }}
                    >
                        <svg
                            className="w-12 h-12 text-white checkmark-draw"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <div className="space-y-3 fade-up fade-up-2">
                    <h2
                        className="text-[28px] font-bold tracking-tight gradient-text"
                    >
                        You're all set!
                    </h2>
                    <p
                        className="max-w-xs mx-auto leading-relaxed text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Your profile is complete. Redirecting to dashboard...
                    </p>
                </div>

                <div className="flex items-center gap-2 pt-2 fade-up fade-up-3">
                    <span
                        className="w-2 h-2 rounded-full dot-pulse-1"
                        style={{ background: 'var(--aurora-purple)' }}
                    />
                    <span
                        className="w-2 h-2 rounded-full dot-pulse-2"
                        style={{ background: 'var(--aurora-blue)' }}
                    />
                    <span
                        className="w-2 h-2 rounded-full dot-pulse-3"
                        style={{ background: 'var(--aurora-teal)' }}
                    />
                </div>

                <div
                    className="flex items-center gap-2 text-sm fade-up fade-up-4"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Redirecting to dashboard...
                </div>

                <button
                    onClick={() => {
                        dispatch(completeOnboarding());
                        navigate("/home");
                    }}
                    className="btn btn-primary px-8 py-3 text-sm mt-2 fade-up fade-up-5"
                >
                    Go to Dashboard Now
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
