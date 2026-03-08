import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { SpinnerGap } from "@phosphor-icons/react";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for guest-only pages (login, register).
 * - Shows loading spinner while auth is initializing
 * - Redirects to /dashboard if already authenticated
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SpinnerGap className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
