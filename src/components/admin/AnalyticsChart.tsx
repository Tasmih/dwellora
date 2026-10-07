"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";
import { FiBarChart2, FiPieChart, FiTrendingUp } from "react-icons/fi";

type AnalyticsChartProps = {
  stats: {
    services: number;
    projects: number;
    blogs: number;
    inquiries: number;
  };
  loading?: boolean;
};

type DataPoint = {
  name: string;
  value: number;
  percentage: number;
  color: string;
};

type TooltipPayloadItem = {
  name?: string;
  value?: number;
  payload?: DataPoint;
};

function subscribe() {
  return () => {};
}

function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data?.value ?? payload[0].value ?? 0;
    const name = data?.name ?? payload[0].name ?? "";
    const percentage = data?.percentage;

    return (
      <div className="rounded-xl border border-border bg-[#faf6ef] p-3 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {name}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-brand">{value}</span>
          <span className="text-xs text-muted">
            {value === 1 ? "record" : "records"}
          </span>
          {percentage !== undefined && (
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-brand">
              {percentage}%
            </span>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default function AnalyticsChart({
  stats,
  loading = false,
}: AnalyticsChartProps) {
  const mounted = useIsMounted();
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const total =
    stats.services + stats.projects + stats.blogs + stats.inquiries;

  const data: DataPoint[] = [
    {
      name: "Services",
      value: stats.services,
      percentage: total > 0 ? Math.round((stats.services / total) * 100) : 0,
      color: "#193532", // Forest Green
    },
    {
      name: "Projects",
      value: stats.projects,
      percentage: total > 0 ? Math.round((stats.projects / total) * 100) : 0,
      color: "#4d7c6f", // Sage Green
    },
    {
      name: "Blogs & Vlogs",
      value: stats.blogs,
      percentage: total > 0 ? Math.round((stats.blogs / total) * 100) : 0,
      color: "#c9a365", // Warm Gold
    },
    {
      name: "Inquiries",
      value: stats.inquiries,
      percentage: total > 0 ? Math.round((stats.inquiries / total) * 100) : 0,
      color: "#3d7ca0", // Soft Blue
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-[0_4px_24px_rgba(25,53,50,0.03)]">
      {/* Header with Title & Chart View Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <FiTrendingUp className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Platform Analytics
            </p>
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            Website Content Distribution
          </h2>
          <p className="mt-1 text-sm text-muted">
            Live comparative volume of services, portfolio works, journals, and inquiries.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                chartType === "bar"
                  ? "bg-brand text-background shadow-sm"
                  : "text-muted hover:text-brand"
              }`}
            >
              <FiBarChart2 className="h-3.5 w-3.5" />
              <span>Bar View</span>
            </button>

            <button
              type="button"
              onClick={() => setChartType("pie")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                chartType === "pie"
                  ? "bg-brand text-background shadow-sm"
                  : "text-muted hover:text-brand"
              }`}
            >
              <FiPieChart className="h-3.5 w-3.5" />
              <span>Donut View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Visualization Area */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Main Chart Column */}
        <div className="lg:col-span-8 min-h-[300px]">
          {!mounted || loading ? (
            <div className="flex h-[300px] w-full items-center justify-center rounded-2xl bg-background/50">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <p className="mt-2 text-xs font-medium text-muted">
                  Rendering analytics chart...
                </p>
              </div>
            </div>
          ) : chartType === "bar" ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e8dfd2"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#686b63"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "#e8dfd2" }}
                  />
                  <YAxis
                    stroke="#686b63"
                    fontSize={12}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={{ stroke: "#e8dfd2" }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(201, 163, 101, 0.08)" }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={56}
                    animationDuration={800}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`pie-cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Legend and Distribution Breakdown Column */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-border/70 pt-6 lg:pt-0 lg:pl-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Category Distribution
            </span>
            <span className="text-xs font-medium text-brand">
              Total: <strong>{loading ? "..." : total}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5 transition-colors hover:bg-background"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-brand">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand">
                    {loading ? "..." : item.value}
                  </span>
                  <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted border border-border/60">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-xs text-brand">
            <p className="font-semibold">Live Metric Synchronization</p>
            <p className="mt-0.5 text-muted">
              Visualizes live records directly from your Dwellora database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
