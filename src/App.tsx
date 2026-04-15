import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { SnackbarProvider } from './components/Snackbar';
import { ThemeProvider } from './components/ThemeProvider';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { OnboardingGuard } from './routes/OnboardingGuard';
import { HomeGuard } from './routes/HomeGuard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<OnboardingGuard />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<HomeGuard />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SnackbarProvider>
          <div className="min-h-screen relative" style={{ background: 'var(--bg-deep)' }}>
            <div className="aurora-bg" aria-hidden="true">
              <div className="aurora-blob-3" />
              <div className="aurora-blob-4" />
            </div>

            <div className="grid-overlay" aria-hidden="true" />

            <div className="vignette-overlay" aria-hidden="true" />

            <div className="aurora-bg" aria-hidden="true" style={{ zIndex: 1 }}>
              <div className="floating-orb floating-orb-1" />
              <div className="floating-orb floating-orb-2" />
              <div className="floating-orb floating-orb-3" />
              <div className="floating-orb floating-orb-4" />
              <div className="floating-orb floating-orb-5" />
            </div>

            <div className="noise-overlay" aria-hidden="true" />

            <div className="relative" style={{ zIndex: 2 }}>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </div>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
