import { Link } from "react-router";
import { CalendarBlank, TrendUp } from "@phosphor-icons/react";
import {
  DASHBOARD_GREETING,
  STAT_CARDS,
  QUICK_ACTIONS,
  ACTIVITY_SECTION,
} from "@/constants/dashboard";

/**
 * Dashboard main page — welcome banner, stats overview, quick actions, activity.
 * Uses glassmorphism cards + primary/accent color scheme per Style Guide.
 */
export function DashboardPage() {

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ─── Welcome Banner ─────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-6 sm:p-8">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {DASHBOARD_GREETING.title}
            </h1>
            <p className="mt-1.5 text-primary-foreground/70 text-sm sm:text-base">
              {DASHBOARD_GREETING.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm">
            <CalendarBlank className="h-4 w-4 text-accent" />
            <span>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* ─── Stats Cards ────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-xl bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Subtle color blob behind */}
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-primary/5 blur-2xl" />

            <div className="relative z-10">
              <div
                className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${stat.iconBg} mb-3`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-primary/60 mt-1.5 font-medium">
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Quick Actions ──────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.title}
            to={action.to}
            className={`group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
              action.variant === "primary"
                ? "bg-primary/5 border-primary/15 hover:bg-primary/8"
                : "bg-accent/20 border-accent/30 hover:bg-accent/30"
            }`}
          >
            {/* Decorative blob */}
            <div
              className={`absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-3xl transition-opacity duration-300 opacity-30 group-hover:opacity-50 ${
                action.variant === "primary"
                  ? "bg-primary/20"
                  : "bg-accent/40"
              }`}
            />

            <div className="relative z-10 flex items-start gap-4">
              <div
                className={`shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                  action.variant === "primary"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ─── Activity Section ───────────────────────────── */}
      <section className="rounded-xl bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {ACTIVITY_SECTION.title}
          </h2>
          <TrendUp className="h-5 w-5 text-primary/40" />
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center mb-3">
            <CalendarBlank className="h-7 w-7 text-primary/30" />
          </div>
          <p className="text-sm text-muted-foreground">
            {ACTIVITY_SECTION.emptyMessage}
          </p>
        </div>
      </section>
    </div>
  );
}