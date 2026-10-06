"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import ProjectCard, { type AdminProject } from "@/components/admin/ProjectCard";
import ProjectHeader from "@/components/admin/ProjectHeader";
import Loading from "@/components/common/Loading";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch("/api/projects/admin");

        if (isMounted) {
          setProjects(data.projects || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load projects."
          );
        }
        console.error("Failed to load projects", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(id: string) {
    setProjects((current) => current.filter((item) => item._id !== id));
  }

  function handleStatusChange(
    id: string,
    status: "published" | "unpublished"
  ) {
    setProjects((current) =>
      current.map((item) => (item._id === id ? { ...item, status } : item))
    );
  }

  return (
    <main>
      <div className="site-container py-10 lg:py-12">
        <ProjectHeader />

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
          {loading ? (
            <Loading text="Loading projects..." className="border-0 bg-transparent py-16" />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center text-muted">No projects found. Click &quot;Add Project&quot; to create one.</div>
          ) : (
            <div className="divide-y divide-border">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDeleted={handleDeleted}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
