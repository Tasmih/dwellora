"use client";

import { useRouter } from "next/navigation";

import ProjectForm, {
  type ProjectFormValues,
} from "@/components/admin/ProjectForm";
import { apiFetch } from "@/lib/api";
import { showSuccess } from "@/lib/alert";

export default function CreateProjectPage() {
  const router = useRouter();

  async function handleCreateProject(values: ProjectFormValues) {
    await apiFetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(values),
    });

    showSuccess("Project created successfully.");
    router.replace("/admin/projects");
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Add Project
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Add a renovation showcase project to your portfolio. It will be published after saving.
        </p>
      </div>

      <ProjectForm onSubmit={handleCreateProject} />
    </div>
  );
}
