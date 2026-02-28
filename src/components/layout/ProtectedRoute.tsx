import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { SpinnerGap as Loader2 } from "@phosphor-icons/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for authenticated-only pages.
 * - Shows loading spinner while auth is initializing
 * - Redirects to /login if not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
