"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiTool,
  FiHome,
  FiBookOpen,
  FiMail,
  FiArrowRight,
  FiRefreshCw,
  FiLayers,
  FiPlus,
  FiAlertCircle,
} from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import AnalyticsChart from "@/components/admin/AnalyticsChart";

type StatsData = {
  services: number;
  projects: number;
  blogs: number;
  inquiries: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    services: 0,
    projects: 0,
    blogs: 0,
    inquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshStats() {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch("/api/admin/stats");
      const statsPayload = data.stats || data;
      setStats({
        services: Number(statsPayload.services) || 0,
        projects: Number(statsPayload.projects) || 0,
        blogs: Number(statsPayload.blogs) || 0,
        inquiries: Number(statsPayload.inquiries) || 0,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const data = await apiFetch("/api/admin/stats");
        if (!isMounted) return;
        const statsPayload = data.stats || data;
        setStats({
          services: Number(statsPayload.services) || 0,
          projects: Number(statsPayload.projects) || 0,
          blogs: Number(statsPayload.blogs) || 0,
          inquiries: Number(statsPayload.inquiries) || 0,
        });
      } catch (err) {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard statistics"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      title: "Total Services",
      count: stats.services,
      description: "Active renovation & carpentry offerings",
      href: "/admin/services",
      createHref: "/admin/services/create",
      icon: FiTool,
      accent: "text-accent bg-accent/15",
    },
    {
      title: "Total Projects",
      count: stats.projects,
      description: "Architectural portfolio case studies",
      href: "/admin/projects",
      createHref: "/admin/projects/create",
      icon: FiHome,
      accent: "text-emerald-700 bg-emerald-100/70",
    },
    {
      title: "Total Blogs & Vlogs",
      count: stats.blogs,
      description: "Published articles and video features",
      href: "/admin/blogs",
      createHref: "/admin/blogs/create",
      icon: FiBookOpen,
      accent: "text-amber-700 bg-amber-100/70",
    },
    {
      title: "Total Inquiries",
      count: stats.inquiries,
      description: "Customer quote and contact requests",
      href: "/admin/contact",
      icon: FiMail,
      accent: "text-sky-700 bg-sky-100/70",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-[0_4px_24px_rgba(25,53,50,0.03)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Dwellora Administration
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-muted">
              Live statistics and content management across all Dwellora modules.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshStats}
            disabled={loading}
            className="btn btn-secondary self-start sm:self-auto gap-2"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Stats</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            type="button"
            onClick={refreshStats}
            className="text-xs font-semibold underline hover:text-rose-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group relative flex flex-col justify-between rounded-3xl border border-border/90 bg-surface p-6 shadow-[0_4px_20px_rgba(25,53,50,0.04)] hover:shadow-[0_12px_36px_rgba(25,53,50,0.08)] hover:border-accent/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  {card.createHref && (
                    <Link
                      href={card.createHref}
                      aria-label={`Create new ${card.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted hover:border-accent hover:text-accent transition-colors"
                    >
                      <FiPlus className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-muted">
                    {card.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
                    {loading ? (
                      <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-border/60" />
                    ) : (
                      card.count
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-border/70 pt-4">
                <Link
                  href={card.href}
                  className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand group-hover:text-accent transition-colors"
                >
                  <span>Manage {card.title.replace("Total ", "")}</span>
                  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Analytics Visualization Section */}
      <AnalyticsChart stats={stats} loading={loading} />

      {/* Quick Actions & Taxonomy */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-[0_4px_24px_rgba(25,53,50,0.03)]">
        <h2 className="text-xl font-semibold tracking-tight text-brand">
          Quick Management Links
        </h2>
        <p className="mt-1 text-sm text-muted">
          Shortcuts to frequently accessed catalog and taxonomy sections.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/categories"
            className="group flex items-center justify-between rounded-2xl border border-border p-4 bg-background/50 hover:bg-surface hover:border-accent/50 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <FiLayers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand">Service Categories</p>
                <p className="text-xs text-muted">Organize service offerings</p>
              </div>
            </div>
            <FiArrowRight className="h-4 w-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/services/create"
            className="group flex items-center justify-between rounded-2xl border border-border p-4 bg-background/50 hover:bg-surface hover:border-accent/50 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <FiTool className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand">New Service</p>
                <p className="text-xs text-muted">Add renovation package</p>
              </div>
            </div>
            <FiArrowRight className="h-4 w-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/projects/create"
            className="group flex items-center justify-between rounded-2xl border border-border p-4 bg-background/50 hover:bg-surface hover:border-accent/50 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <FiHome className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand">New Project</p>
                <p className="text-xs text-muted">Showcase portfolio item</p>
              </div>
            </div>
            <FiArrowRight className="h-4 w-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}