import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useSnackbar } from '../components/Snackbar';
import { PersonalProfile } from '../components/onboarding/PersonalProfile';
import { FavoriteSongs } from '../components/onboarding/FavoriteSongs';
import { PaymentInfo } from '../components/onboarding/PaymentInfo';
import { Success } from '../components/onboarding/Success';
import { ThemeToggle } from '../components/ThemeToggle';

const steps = [
    { label: 'Profile', description: 'Your details', icon: 'user' },
    { label: 'Music', description: 'Your taste', icon: 'music' },
    { label: 'Payment', description: 'Billing info', icon: 'card' },
    { label: 'Done', description: 'All set', icon: 'check' },
];

const stepComponents: Record<number, React.ReactNode> = {
    1: <PersonalProfile />,
    2: <FavoriteSongs />,
    3: <PaymentInfo />,
    4: <Success />,
};

export const Onboarding = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const currentStep = useAppSelector((state) => state.onboarding.currentStep);

    const handleLogout = () => {
        dispatch(logout());
        snackbar.show('Logged out successfully', 'neutral');
        navigate('/login');
    };

    return (
        <div className="min-h-screen py-6 px-4 sm:py-10">
            <div className="max-w-xl mx-auto">
                <div
                    className="flex items-center justify-between mb-8 px-5 py-3.5 rounded-2xl fade-up fade-up-1"
                    style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                                background: 'var(--gradient-button)',
                                boxShadow: '0 4px 16px -2px rgba(59, 139, 220, 0.3)',
                            }}
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-bright)' }}>Onboarding</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary px-3.5 py-1.5 text-xs cursor-pointer"
                        >
                            Log out
                        </button>
                    </div>
                </div>

                <div className="mb-8 fade-up fade-up-2">
                    <div className="mb-5">
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                                background: 'rgba(59, 139, 220, 0.1)',
                                color: 'var(--aurora-purple)',
                                border: '1px solid rgba(59, 139, 220, 0.15)',
                            }}
                        >
                            Step {currentStep} of {steps.length}
                        </span>
                    </div>

                    <div className="relative flex justify-between mb-4">
                        <div className="absolute top-5 left-0 right-0 flex" style={{ marginLeft: '28px', marginRight: '28px' }}>
                            {steps.slice(0, -1).map((_, index) => {
                                const isCompleted = currentStep > index + 1;
                                return (
                                    <div
                                        key={index}
                                        className="flex-1 h-[2px] mx-1"
                                        style={{
                                            background: isCompleted
                                                ? 'var(--gradient-aurora)'
                                                : 'rgba(255, 255, 255, 0.06)',
                                            borderRadius: '1px',
                                            transition: 'background 0.5s ease',
                                        }}
                                    />
                                );
                            })}
                        </div>

                        {steps.map((step, index) => {
                            const stepNum = index + 1;
                            const isCompleted = currentStep > stepNum;
                            const isCurrent = currentStep === stepNum;
                            const isPending = currentStep < stepNum;

                            return (
                                <div key={step.label} className="flex flex-col items-center relative z-10">
                                    <div className="relative">
                                        {isCurrent && (
                                            <span
                                                className="absolute inset-0 rounded-full animate-pulse-ring"
                                                style={{
                                                    background: 'var(--gradient-button)',
                                                    opacity: 0.3,
                                                }}
                                            />
                                        )}
                                        <div
                                            className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                                            style={{
                                                background: isCompleted
                                                    ? 'var(--gradient-aurora)'
                                                    : isCurrent
                                                        ? 'var(--bg-surface)'
                                                        : 'var(--bg-surface)',
                                                border: isCurrent
                                                    ? '2px solid var(--aurora-purple)'
                                                    : isPending
                                                        ? '2px solid rgba(255, 255, 255, 0.06)'
                                                        : 'none',
                                                color: isCompleted
                                                    ? 'white'
                                                    : isCurrent
                                                        ? 'var(--text-bright)'
                                                        : 'var(--text-muted)',
                                                boxShadow: isCompleted
                                                    ? '0 4px 16px -4px rgba(59, 139, 220, 0.4)'
                                                    : isCurrent
                                                        ? '0 0 20px -4px rgba(59, 139, 220, 0.3)'
                                                        : 'none',
                                                transition: 'all 0.4s var(--ease-out-expo)',
                                            }}
                                        >
                                            {isCompleted ? (
                                                <svg className="w-5 h-5 checkmark-draw" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                stepNum
                                            )}
                                        </div>
                                    </div>
                                    <span
                                        className="mt-2.5 text-xs font-medium"
                                        style={{
                                            color: isCurrent
                                                ? 'var(--aurora-purple)'
                                                : isCompleted
                                                    ? 'var(--text-secondary)'
                                                    : 'var(--text-muted)',
                                            transition: 'color 0.3s ease',
                                        }}
                                    >
                                        {step.label}
                                    </span>
                                    <span
                                        className="text-[10px]"
                                        style={{
                                            color: isPending ? 'var(--text-ghost)' : 'var(--text-muted)',
                                            transition: 'color 0.3s ease',
                                        }}
                                    >
                                        {step.description}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                    >
                        <div
                            className="h-full progress-bar-aurora"
                            style={{
                                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                                transition: 'width 0.5s var(--ease-out-expo)',
                            }}
                        />
                    </div>
                </div>

                <div
                    key={currentStep}
                    className="glass-card p-6 sm:p-8 fade-up"
                    style={{ animationDelay: '0ms' }}
                >
                    {stepComponents[currentStep]}
                </div>
            </div>
        </div>
    );
};
