import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { GuestRoute } from "./components/layout/GuestRoute";
import { useAuthStore } from "./stores/authStore";
import { setupInterceptors } from "./services/setupInterceptors";

// Setup Axios interceptors once at module level
setupInterceptors();

function App() {
  const initialize = useAuthStore((s) => s.initialize);

  // Restore auth session on app mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />

          {/* Guest-only routes (redirect to dashboard if logged in) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          {/* Protected routes (redirect to login if not logged in) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
