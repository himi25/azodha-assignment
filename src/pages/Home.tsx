import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { setPersonalProfile, setFavoriteSongs } from '../features/onboarding/onboardingSlice';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/Snackbar';
import { Formik, Form, Field, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';
import { ThemeToggle } from '../components/ThemeToggle';

const MAX_SONGS = 5;

const profileSchema = Yup.object({
    fullName: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Full name is required'),
    age: Yup.number()
        .typeError('Age must be a number')
        .min(13, 'Must be at least 13 years old')
        .max(120, 'Invalid age')
        .required('Age is required'),
    email: Yup.string()
        .matches(
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            'Please enter a valid email with domain'
        )
        .required('Email is required'),
    songs: Yup.array()
        .of(Yup.string().required('Song name is required'))
        .min(1, 'Add at least one song')
        .max(MAX_SONGS, `Maximum ${MAX_SONGS} songs allowed`),
});

export const Home = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const [isEditing, setIsEditing] = useState(false);
    const username = useAppSelector((state) => state.auth.username);
    const { personalProfile, favoriteSongs } = useAppSelector(
        (state) => state.onboarding
    );

    const handleLogout = () => {
        dispatch(logout());
        snackbar.show('Logged out successfully', 'neutral');
        navigate('/login');
    };

    const filteredSongs = favoriteSongs.filter((song: string) => song.trim());

    const getInitials = () => {
        const name = personalProfile.fullName || username || 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) return parts[0].charAt(0) + parts[1].charAt(0);
        return name.charAt(0).toUpperCase();
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="min-h-screen">
            <nav
                className="sticky top-0 z-20 px-6 py-3 dashboard-nav"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
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
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-bright)' }}>Dashboard</span>
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
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div
                    className="glass-card relative overflow-hidden mb-8 fade-up fade-up-1"
                    style={{ minHeight: '220px' }}
                >
                    <div
                        className="absolute inset-0 hero-banner-bg"
                    />
                    <div
                        className="absolute -top-12 -right-12 w-48 h-48 rounded-full hero-orb-1"
                    />
                    <div
                        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full hero-orb-2"
                    />

                    <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden p-[3px]"
                            style={{
                                background: 'var(--gradient-aurora)',
                                boxShadow: '0 8px 32px -4px rgba(59, 139, 220, 0.4)',
                            }}
                        >
                            <div
                                className="w-full h-full rounded-[14px] flex items-center justify-center overflow-hidden"
                                style={{ background: 'var(--bg-surface)' }}
                            >
                                {personalProfile.profilePicture ? (
                                    <img
                                        src={personalProfile.profilePicture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span
                                        className="text-3xl font-bold gradient-text"
                                    >
                                        {getInitials()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-medium mb-1" style={{ color: 'var(--aurora-purple)' }}>
                                {getGreeting()} 👋
                            </p>
                            <h1
                                className="text-3xl sm:text-4xl font-bold tracking-tight"
                                style={{ color: 'var(--text-bright)' }}
                            >
                                {personalProfile.fullName || username}
                            </h1>
                            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                                Your profile is complete and ready to go. Manage your details below.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'} px-5 py-2.5 text-sm cursor-pointer flex-shrink-0`}
                        >
                            {isEditing ? (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {isEditing ? (
                    <Formik
                        initialValues={{
                            fullName: personalProfile.fullName,
                            age: personalProfile.age,
                            email: personalProfile.email,
                            profilePicture: personalProfile.profilePicture,
                            songs: favoriteSongs.length ? favoriteSongs : [''],
                        }}
                        validationSchema={profileSchema}
                        onSubmit={(values) => {
                            dispatch(setPersonalProfile({
                                fullName: values.fullName,
                                age: values.age,
                                email: values.email,
                                profilePicture: values.profilePicture,
                            }));
                            dispatch(setFavoriteSongs(values.songs));
                            snackbar.show('Profile updated', 'success');
                            setIsEditing(false);
                        }}
                    >
                        {({ values, errors, touched, isValid }) => {
                            const canAddMore = values.songs.length < MAX_SONGS;

                            return (
                                <Form>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-up fade-up-2">
                                        <div className="glass-card p-7">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    style={{ background: 'rgba(59, 139, 220, 0.1)' }}
                                                >
                                                    <svg className="w-4 h-4" style={{ color: 'var(--aurora-purple)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-bright)' }}>Personal Information</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="fullName" className="label">Full Name</label>
                                                    <div className="relative">
                                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <Field
                                                            id="fullName"
                                                            name="fullName"
                                                            type="text"
                                                            className={`input ${touched.fullName && errors.fullName ? 'input-error' : ''}`}
                                                            style={{ paddingLeft: '42px' }}
                                                        />
                                                    </div>
                                                    {touched.fullName && errors.fullName && (
                                                        <p className="error-text">{errors.fullName}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="age" className="label">Age</label>
                                                        <div className="relative">
                                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <Field
                                                                id="age"
                                                                name="age"
                                                                type="number"
                                                                className={`input ${touched.age && errors.age ? 'input-error' : ''}`}
                                                                style={{ paddingLeft: '42px' }}
                                                            />
                                                        </div>
                                                        {touched.age && errors.age && (
                                                            <p className="error-text">{errors.age}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email" className="label">Email</label>
                                                        <div className="relative">
                                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <Field
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                className={`input ${touched.email && errors.email ? 'input-error' : ''}`}
                                                                style={{ paddingLeft: '42px' }}
                                                            />
                                                        </div>
                                                        {touched.email && errors.email && (
                                                            <p className="error-text">{errors.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-card p-7">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    style={{ background: 'rgba(20, 184, 166, 0.1)' }}
                                                >
                                                    <svg className="w-4 h-4" style={{ color: 'var(--aurora-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-bright)' }}>Favorite Songs</h3>
                                            </div>

                                            <FieldArray name="songs">
                                                {({ push, remove }) => (
                                                    <div className="space-y-3">
                                                        {values.songs.map((_: string, index: number) => {
                                                            const fieldName = `songs.${index}`;
                                                            const fieldTouched = getIn(touched, fieldName);
                                                            const fieldError = getIn(errors, fieldName);
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 song-item"
                                                                >
                                                                    <div
                                                                        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5"
                                                                        style={{
                                                                            background: 'var(--gradient-button)',
                                                                            boxShadow: '0 4px 12px -2px rgba(59, 139, 220, 0.3)',
                                                                        }}
                                                                    >
                                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <Field
                                                                            name={fieldName}
                                                                            placeholder={`Song ${index + 1}`}
                                                                            className={`input ${fieldTouched && fieldError ? 'input-error' : ''}`}
                                                                        />
                                                                        {fieldTouched && fieldError && (
                                                                            <p className="error-text">{fieldError}</p>
                                                                        )}
                                                                    </div>
                                                                    {values.songs.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => remove(index)}
                                                                            className="p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                                                                            style={{ color: 'var(--text-muted)' }}
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.color = 'var(--aurora-pink)';
                                                                                e.currentTarget.style.background = 'rgba(224, 85, 119, 0.1)';
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.color = 'var(--text-muted)';
                                                                                e.currentTarget.style.background = 'transparent';
                                                                            }}
                                                                            aria-label="Remove song"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}

                                                        {canAddMore && (
                                                            <button
                                                                type="button"
                                                                onClick={() => push('')}
                                                                className="flex items-center gap-2 w-full p-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer"
                                                                style={{
                                                                    color: 'var(--aurora-purple)',
                                                                    background: 'rgba(59, 139, 220, 0.04)',
                                                                    border: '1px dashed rgba(59, 139, 220, 0.2)',
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.background = 'rgba(59, 139, 220, 0.08)';
                                                                    e.currentTarget.style.borderColor = 'rgba(59, 139, 220, 0.35)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.background = 'rgba(59, 139, 220, 0.04)';
                                                                    e.currentTarget.style.borderColor = 'rgba(59, 139, 220, 0.2)';
                                                                }}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                                Add song ({values.songs.length}/{MAX_SONGS})
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </FieldArray>
                                        </div>
                                    </div>

                                    <div className="mt-6 fade-up fade-up-3">
                                        <button
                                            type="submit"
                                            disabled={!isValid}
                                            className="btn btn-primary w-full py-3.5 text-sm"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </button>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="glass-card p-6 relative overflow-hidden fade-up fade-up-2 group hover:scale-[1.02] transition-transform duration-300">
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] card-accent-bar"
                            />
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59, 139, 220, 0.06), transparent 70%)' }}
                            />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'rgba(59, 139, 220, 0.1)' }}
                                    >
                                        <svg className="w-4.5 h-4.5" style={{ color: 'var(--aurora-purple)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Full Name</p>
                                </div>
                                <p className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-bright)' }}>
                                    {personalProfile.fullName}
                                </p>
                            </div>
                        </div>

                        <div className="glass-card p-6 relative overflow-hidden fade-up fade-up-3 group hover:scale-[1.02] transition-transform duration-300">
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] card-accent-bar"
                            />
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59, 139, 220, 0.06), transparent 70%)' }}
                            />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'rgba(59, 139, 220, 0.1)' }}
                                    >
                                        <svg className="w-4.5 h-4.5" style={{ color: 'var(--aurora-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email</p>
                                </div>
                                <p className="text-lg font-medium truncate" style={{ color: 'var(--text-bright)' }}>
                                    {personalProfile.email}
                                </p>
                            </div>
                        </div>

                        <div className="glass-card p-6 relative overflow-hidden fade-up fade-up-4 group hover:scale-[1.02] transition-transform duration-300">
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] card-accent-bar"
                            />
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.06), transparent 70%)' }}
                            />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'rgba(20, 184, 166, 0.1)' }}
                                    >
                                        <svg className="w-4.5 h-4.5" style={{ color: 'var(--aurora-teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Age</p>
                                </div>
                                <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-bright)' }}>
                                    {personalProfile.age}
                                    <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>years</span>
                                </p>
                            </div>
                        </div>

                        {filteredSongs.length > 0 && (
                            <div className="sm:col-span-2 lg:col-span-3 glass-card p-7 relative overflow-hidden fade-up fade-up-5 group">
                                <div
                                    className="absolute top-0 left-0 right-0 h-[2px] card-accent-bar"
                                />
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: 'radial-gradient(ellipse 40% 60% at 50% 0%, rgba(59, 139, 220, 0.04), transparent 70%)' }}
                                />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-5">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                                            style={{ background: 'rgba(224, 85, 119, 0.1)' }}
                                        >
                                            <svg className="w-4.5 h-4.5" style={{ color: 'var(--aurora-pink)' }} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                            </svg>
                                        </div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                            Favorite Songs
                                        </p>
                                        <span
                                            className="ml-auto px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                            style={{
                                                background: 'rgba(59, 139, 220, 0.1)',
                                                color: 'var(--aurora-purple)',
                                            }}
                                        >
                                            {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {filteredSongs.map((song: string, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 song-item"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        background: 'var(--gradient-button)',
                                                        boxShadow: '0 4px 12px -2px rgba(59, 139, 220, 0.3)',
                                                    }}
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                                    {song}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
