interface AppLogoProps {
  className?: string;
}

/**
 * Custom app logo — Mount Fuji + Japanese fan.
 * Uses the project logo image from /logo.png.
 */
export function AppLogo({ className }: AppLogoProps) {
  return (
    <img
      src="/logo.png"
      alt="LearningApp Logo"
      className={className}
    />
  );
}
