"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ProjectForm, {
  type ProjectFormValues,
} from "@/components/admin/ProjectForm";
import { apiFetch } from "@/lib/api";
import { showSuccess } from "@/lib/alert";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [initialValues, setInitialValues] = useState<ProjectFormValues | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProject() {
      if (!id) return;

      try {
        const data = await apiFetch(`/api/projects/${id}`);
        if (isMounted) {
          if (data.project) {
            setInitialValues({
              title: data.project.title || "",
              slug: data.project.slug || "",
              shortDescription: data.project.shortDescription || "",
              description: data.project.description || "",
              coverImage: data.project.coverImage || "",
              gallery: data.project.gallery || [],
              categoryId: data.project.categoryId || null,
              client: data.project.client || "",
              location: data.project.location || "",
              year: data.project.year || "",
              features: data.project.features || [],
              seo: data.project.seo || undefined,
            });
          } else {
            setLoadError("Project not found.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load project."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleUpdateProject(values: ProjectFormValues) {
    if (!id) return;

    await apiFetch(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    showSuccess("Project updated successfully.");
    router.replace("/admin/projects");
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
        Loading project details...
      </div>
    );
  }

  if (loadError || !initialValues) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-semibold text-brand">Project Not Found</h2>
        <p className="mt-2 text-sm text-muted">
          {loadError || "The requested project could not be loaded."}
        </p>
        <Link href="/admin/projects" className="btn btn-secondary mt-6">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Edit Project
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Update project information, gallery showcase, scope details, and SEO metadata.
        </p>
      </div>

      <ProjectForm
        initialValues={initialValues}
        onSubmit={handleUpdateProject}
        submitLabel="Save Changes"
        loadingLabel="Saving..."
      />
    </div>
  );
}
