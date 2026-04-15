import { Formik, Form, Field, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    setFavoriteSongs,
    nextStep,
    prevStep,
} from '../../features/onboarding/onboardingSlice';

const MAX_SONGS = 5;

const songsSchema = Yup.object({
    songs: Yup.array()
        .of(Yup.string().required('Song name is required'))
        .min(1, 'Add at least one song')
        .max(MAX_SONGS, `Maximum ${MAX_SONGS} songs allowed`),
});

interface FormValues {
    songs: string[];
}

export const FavoriteSongs = () => {
    const dispatch = useAppDispatch();
    const { favoriteSongs } = useAppSelector((state) => state.onboarding);

    return (
        <div>
            <div className="mb-7 fade-up fade-up-1">
                <div className="flex items-center gap-2">
                    <h2
                        className="text-lg font-semibold"
                        style={{ color: 'var(--text-bright)' }}
                    >
                        Favorite Songs
                    </h2>
                </div>
                <div
                    className="w-10 h-[3px] rounded-full mt-2 mb-2"
                    style={{ background: 'var(--gradient-aurora)' }}
                />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    What music moves you? Add up to {MAX_SONGS} favorites
                </p>
            </div>

            <Formik<FormValues>
                initialValues={{
                    songs: favoriteSongs.length ? favoriteSongs : [''],
                }}
                validationSchema={songsSchema}
                onSubmit={(values) => {
                    dispatch(setFavoriteSongs(values.songs));
                    dispatch(nextStep());
                }}
            >
                {({ values, errors, touched, isValid }) => {
                    const canAddMore = values.songs.length < MAX_SONGS;

                    return (
                        <Form>
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
                                                    className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 fade-up"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.02)',
                                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                                        animationDelay: `${(index + 2) * 60}ms`,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                                    }}
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

                                        {canAddMore ? (
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
                                                Add another song ({values.songs.length}/{MAX_SONGS})
                                            </button>
                                        ) : (
                                            <div
                                                className="flex items-center gap-2 p-3 text-sm rounded-xl"
                                                style={{
                                                    color: 'var(--text-secondary)',
                                                    background: 'rgba(255, 255, 255, 0.02)',
                                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                                }}
                                            >
                                                <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Maximum {MAX_SONGS} songs reached
                                            </div>
                                        )}
                                    </div>
                                )}
                            </FieldArray>

                            <div
                                className="flex gap-3 mt-6 pt-5"
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
                    );
                }}
            </Formik>
        </div>
    );
};
