import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    setPersonalProfile,
    nextStep,
} from '../../features/onboarding/onboardingSlice';

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
            'Please enter a valid email with domain (e.g., user@example.com)'
        )
        .required('Email is required'),
});

export const PersonalProfile = () => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { personalProfile } = useAppSelector((state) => state.onboarding);

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: string) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFieldValue('profilePicture', reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <div className="mb-7 fade-up fade-up-1">
                <h2
                    className="text-lg font-semibold"
                    style={{ color: 'var(--text-bright)' }}
                >
                    Personal Profile
                </h2>
                <div
                    className="w-10 h-[3px] rounded-full mt-2 mb-2"
                    style={{ background: 'var(--gradient-aurora)' }}
                />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Let's start with your basic information
                </p>
            </div>

            <Formik
                initialValues={{
                    fullName: personalProfile.fullName,
                    age: personalProfile.age,
                    email: personalProfile.email,
                    profilePicture: personalProfile.profilePicture,
                }}
                validationSchema={profileSchema}
                onSubmit={(values) => {
                    dispatch(setPersonalProfile(values));
                    dispatch(nextStep());
                }}
            >
                {({ errors, touched, values, setFieldValue, isValid }) => (
                    <Form className="space-y-5">
                        <div
                            className="flex items-center gap-4 p-4 rounded-xl cursor-pointer group transition-all duration-300 fade-up fade-up-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(59, 139, 220, 0.2)';
                                e.currentTarget.style.background = 'rgba(59, 139, 220, 0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                            }}
                        >
                            <div className="relative">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105"
                                    style={{
                                        background: values.profilePicture
                                            ? 'transparent'
                                            : 'var(--bg-elevated)',
                                        border: values.profilePicture
                                            ? 'none'
                                            : '2px dashed rgba(59, 139, 220, 0.3)',
                                        padding: values.profilePicture ? '2px' : '0',
                                        backgroundImage: values.profilePicture
                                            ? 'var(--gradient-aurora)'
                                            : undefined,
                                    }}
                                >
                                    {values.profilePicture ? (
                                        <img
                                            src={values.profilePicture}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <svg className="w-7 h-7" style={{ color: 'var(--text-muted)' }} fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    )}
                                </div>
                                <div
                                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                                    style={{
                                        background: 'var(--gradient-button)',
                                        boxShadow: '0 4px 12px -2px rgba(59, 139, 220, 0.4)',
                                    }}
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                hidden
                                onChange={(e) => handleFileChange(e, setFieldValue)}
                            />
                            <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Profile photo</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Click to upload</p>
                            </div>
                        </div>

                        <div className="fade-up fade-up-3">
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
                                    placeholder="John Doe"
                                />
                            </div>
                            {touched.fullName && errors.fullName && (
                                <p className="error-text">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 fade-up fade-up-4">
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
                                        placeholder="25"
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
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {touched.email && errors.email && (
                                    <p className="error-text">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 fade-up fade-up-5">
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-full py-3 text-sm"
                            >
                                Continue
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
