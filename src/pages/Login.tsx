import { useState } from 'react';

import { useNavigate, Navigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';
import { useSnackbar } from '../components/Snackbar';
import { validateUser, TEST_CREDENTIALS } from '../utils/userStorage';
import { ThemeToggle } from '../components/ThemeToggle';

const loginSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

export const Login = () => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const isCompleted = useAppSelector((state) => state.onboarding.isCompleted);

    if (isAuthenticated) {
        return <Navigate to={isCompleted ? '/home' : '/onboarding'} replace />;
    }

    return (
        <div className="min-h-screen flex relative">
            <div className="absolute top-5 right-5 z-10">
                <ThemeToggle />
            </div>

            <div
                className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center p-12 overflow-hidden"
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(59, 139, 220, 0.08) 0%, transparent 70%)',
                    }}
                />

                <div className="relative z-10 text-center max-w-md">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 fade-up fade-up-1"
                        style={{
                            background: 'var(--gradient-aurora)',
                            boxShadow: '0 12px 48px -8px rgba(59, 139, 220, 0.5)',
                        }}
                    >
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h1
                        className="text-5xl font-bold tracking-tight mb-4 fade-up fade-up-2"
                        style={{ color: 'var(--text-bright)' }}
                    >
                        Your journey<br />
                        <span className="gradient-text">starts here.</span>
                    </h1>

                    <p
                        className="text-lg leading-relaxed fade-up fade-up-3"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Set up your profile, share your music taste, and unlock a personalized experience in minutes.
                    </p>

                    <div className="mt-10 flex flex-col items-center fade-up fade-up-4">
                        <div className="space-y-4 text-left">
                            {[
                                { icon: '⚡', text: 'Quick & easy — takes under 2 minutes' },
                                { icon: '🎵', text: 'Tell us your favorite songs' },
                                { icon: '🔒', text: 'Your data is secure & encrypted' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-lg">{feature.icon}</span>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
                <div className="w-full max-w-[400px]">
                    <div className="text-center mb-8 lg:hidden fade-up fade-up-1">
                        <div
                            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                            style={{
                                background: 'var(--gradient-button)',
                                boxShadow: '0 8px 32px -4px rgba(59, 139, 220, 0.4)',
                            }}
                        >
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center mb-7 fade-up fade-up-1">
                        <h2
                            className="text-[26px] font-bold tracking-tight"
                            style={{ color: 'var(--text-bright)' }}
                        >
                            Welcome back
                        </h2>
                        <p
                            className="mt-1.5 text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Sign in to continue your onboarding
                        </p>
                    </div>

                    <div className="glass-card p-7 fade-up fade-up-3">
                        {error && (
                            <div
                                className="mb-5 p-3.5 rounded-xl flex items-center gap-2.5"
                                style={{
                                    background: 'rgba(224, 85, 119, 0.08)',
                                    border: '1px solid rgba(224, 85, 119, 0.2)',
                                }}
                            >
                                <div
                                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'var(--gradient-danger)' }}
                                >
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium" style={{ color: 'var(--aurora-pink)' }}>{error}</p>
                            </div>
                        )}

                        <Formik
                            initialValues={{ username: TEST_CREDENTIALS.username, password: TEST_CREDENTIALS.password }}
                            validationSchema={loginSchema}
                            onSubmit={(values) => {
                                if (validateUser(values.username, values.password)) {
                                    dispatch(login(values.username));
                                    snackbar.show('Signed in successfully', 'success');
                                    navigate('/onboarding');
                                } else {
                                    setError('Invalid username or password');
                                    snackbar.show('Invalid credentials', 'error');
                                }
                            }}
                        >
                            {({ errors, touched, isValid }) => (
                                <Form className="space-y-5">
                                    <div className="fade-up fade-up-4">
                                        <label htmlFor="username" className="label">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <Field
                                                id="username"
                                                name="username"
                                                type="text"
                                                autoComplete="username"
                                                className={`input ${touched.username && errors.username ? 'input-error' : ''}`}
                                                style={{ paddingLeft: '42px' }}
                                                placeholder="Enter your username"
                                            />
                                        </div>
                                        {touched.username && errors.username && (
                                            <p className="error-text">{errors.username}</p>
                                        )}
                                    </div>

                                    <div className="fade-up fade-up-5">
                                        <label htmlFor="password" className="label">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <Field
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                className={`input ${touched.password && errors.password ? 'input-error' : ''}`}
                                                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center"
                                                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                tabIndex={-1}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {touched.password && errors.password && (
                                            <p className="error-text">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="fade-up fade-up-6">
                                        <button
                                            type="submit"
                                            disabled={!isValid}
                                            className="btn btn-primary w-full py-3 text-sm"
                                        >
                                            Sign in
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};
