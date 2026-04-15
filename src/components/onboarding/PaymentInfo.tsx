import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    setPaymentInfo,
    nextStep,
    prevStep,
} from '../../features/onboarding/onboardingSlice';

const validateExpiryDate = (value: string | undefined): boolean => {
    if (!value) return false;
    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!match) return false;

    const [, monthStr, yearStr] = match;
    const month = parseInt(monthStr, 10);
    const year = 2000 + parseInt(yearStr, 10);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
};

const paymentSchema = Yup.object({
    cardNumber: Yup.string()
        .matches(/^\d{16}$/, 'Card number must be 16 digits')
        .required('Card number is required'),
    expiryDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY')
        .test('future-date', 'Card has expired', validateExpiryDate)
        .required('Expiry date is required'),
    cvv: Yup.string()
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
        .required('CVV is required'),
});

const handleCardNumberInput = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setFieldValue('cardNumber', value);
};

const handleExpiryInput = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
) => {
    let value = e.target.value.replace(/[^\d/]/g, '');

    if (value.length === 2 && !value.includes('/')) {
        value = value + '/';
    }

    value = value.slice(0, 5);
    setFieldValue('expiryDate', value);
};

const handleCvvInput = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFieldValue('cvv', value);
};

export const PaymentInfo = () => {
    const dispatch = useAppDispatch();
    const { paymentInfo } = useAppSelector((state) => state.onboarding);
    const [showCvv, setShowCvv] = useState(false);

    return (
        <div>
            <div className="mb-7 fade-up fade-up-1">
                <h2
                    className="text-lg font-semibold"
                    style={{ color: 'var(--text-bright)' }}
                >
                    Payment Details
                </h2>
                <div
                    className="w-10 h-[3px] rounded-full mt-2 mb-2"
                    style={{ background: 'var(--gradient-aurora)' }}
                />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Secure billing information for your account
                </p>
            </div>

            <div
                className="flex items-center gap-3 p-3.5 mb-6 rounded-xl fade-up fade-up-2"
                style={{
                    background: 'rgba(20, 184, 166, 0.06)',
                    border: '1px solid rgba(20, 184, 166, 0.12)',
                    borderLeft: '3px solid var(--aurora-teal)',
                }}
            >
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                        background: 'rgba(20, 184, 166, 0.12)',
                    }}
                >
                    <svg className="w-4.5 h-4.5" style={{ color: 'var(--aurora-teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--aurora-teal)' }}>Secure & encrypted</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(20, 184, 166, 0.6)' }}>Your data is protected</p>
                </div>
            </div>

            <Formik
                initialValues={{
                    cardNumber: paymentInfo.cardNumber,
                    expiryDate: paymentInfo.expiryDate,
                    cvv: paymentInfo.cvv,
                }}
                validationSchema={paymentSchema}
                onSubmit={(values) => {
                    dispatch(setPaymentInfo(values));
                    dispatch(nextStep());
                }}
            >
                {({ errors, touched, isValid, setFieldValue, values }) => (
                    <Form className="space-y-4">
                        <div className="fade-up fade-up-3">
                            <label htmlFor="cardNumber" className="label">Card Number</label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <Field
                                    id="cardNumber"
                                    name="cardNumber"
                                    placeholder="1234567890123456"
                                    value={values.cardNumber}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleCardNumberInput(e, setFieldValue)}
                                    inputMode="numeric"
                                    autoComplete="cc-number"
                                    className={`input ${touched.cardNumber && errors.cardNumber ? 'input-error' : ''}`}
                                    style={{ paddingLeft: '46px' }}
                                />
                            </div>
                            {touched.cardNumber && errors.cardNumber && (
                                <p className="error-text">{errors.cardNumber}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 fade-up fade-up-4">
                            <div>
                                <label htmlFor="expiryDate" className="label">Expiry Date</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <Field
                                        id="expiryDate"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        value={values.expiryDate}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleExpiryInput(e, setFieldValue)}
                                        inputMode="numeric"
                                        autoComplete="cc-exp"
                                        className={`input ${touched.expiryDate && errors.expiryDate ? 'input-error' : ''}`}
                                        style={{ paddingLeft: '42px' }}
                                    />
                                </div>
                                {touched.expiryDate && errors.expiryDate && (
                                    <p className="error-text">{errors.expiryDate}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="cvv" className="label">CVV</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <Field
                                        id="cvv"
                                        name="cvv"
                                        type={showCvv ? 'text' : 'password'}
                                        placeholder="•••"
                                        value={values.cvv}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleCvvInput(e, setFieldValue)}
                                        inputMode="numeric"
                                        autoComplete="cc-csc"
                                        className={`input ${touched.cvv && errors.cvv ? 'input-error' : ''}`}
                                        style={{ paddingLeft: '42px', paddingRight: '38px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCvv(!showCvv)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                                        style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                        tabIndex={-1}
                                        aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
                                    >
                                        {showCvv ? (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {touched.cvv && errors.cvv && (
                                    <p className="error-text">{errors.cvv}</p>
                                )}
                            </div>
                        </div>

                        <div
                            className="flex gap-3 pt-5 mt-2 fade-up fade-up-5"
                            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
                        >
                            <button
                                type="button"
                                onClick={() => dispatch(prevStep())}
                                className="btn btn-secondary flex-1 py-3 text-sm"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary flex-1 py-3 text-sm"
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
