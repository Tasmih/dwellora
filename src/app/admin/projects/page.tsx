"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import ProjectCard, { type AdminProject } from "@/components/admin/ProjectCard";
import ProjectHeader from "@/components/admin/ProjectHeader";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        const data = await apiFetch("/api/projects/admin");

        if (isMounted) {
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to load projects", error);
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
            <div className="p-6 text-muted">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-muted">No projects found.</div>
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
