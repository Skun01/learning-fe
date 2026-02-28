import { useState, useEffect } from "react";
import { Link } from "react-router";
import { GraduationCap, List as Menu, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants/homepage";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Đăng ký miễn phí</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden pb-4 space-y-2">
            <Button variant="ghost" asChild className="w-full justify-center">
              <Link to="/login">Đăng nhập</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/register">Đăng ký miễn phí</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
