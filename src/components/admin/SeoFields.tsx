"use client";

export type SeoValues = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
};

export const emptySeo: SeoValues = {
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonicalUrl: "",
};

type SeoFieldsProps = {
  value: SeoValues;
  onChange: (value: SeoValues) => void;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackImage: string;
};

const fields: {
  name: keyof SeoValues;
  label: string;
  placeholder: string;
  multiline?: boolean;
  url?: boolean;
}[] = [
  {
    name: "metaTitle",
    label: "Meta Title",
    placeholder: "Kitchen Renovation | Dwellora",
  },
  {
    name: "metaDescription",
    label: "Meta Description",
    placeholder: "Write a clear summary of this page.",
    multiline: true,
  },
  {
    name: "keywords",
    label: "Keywords",
    placeholder: "kitchen renovation, carpentry, home renovation",
  },
  {
    name: "ogTitle",
    label: "Open Graph Title",
    placeholder: "Optional social sharing title",
  },
  {
    name: "ogDescription",
    label: "Open Graph Description",
    placeholder: "Optional social sharing description",
    multiline: true,
  },
  {
    name: "ogImage",
    label: "Open Graph Image URL",
    placeholder: "https://example.com/social-image.jpg",
    url: true,
  },
  {
    name: "canonicalUrl",
    label: "Canonical URL",
    placeholder: "Leave blank to use this page's URL",
    url: true,
  },
];

export default function SeoFields({
  value,
  onChange,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
}: SeoFieldsProps) {
  const title = value.metaTitle.trim() || fallbackTitle.trim();
  const description =
    value.metaDescription.trim() ||
    fallbackDescription.trim().slice(0, 160);

  const image = value.ogImage.trim() || fallbackImage.trim();

  const checks = [
    {
      label: "Page title is available",
      passed: Boolean(title),
    },
    {
      label: "Title is within the suggested 30–60 characters",
      passed: title.length >= 30 && title.length <= 60,
    },
    {
      label: "Description is within the suggested 120–160 characters",
      passed: description.length >= 120 && description.length <= 160,
    },
    {
      label: "Social sharing image URL is provided",
      passed: Boolean(image),
    },
  ];

  const completed = checks.filter((check) => check.passed).length;

  return (
    <section className="space-y-6 border-t border-border pt-6">
      <div>
        <h2 className="text-xl font-semibold text-brand">
          SEO Settings
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Optional. Empty fields use the page content as defaults.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.multiline ? "space-y-2 md:col-span-2" : "space-y-2"}
          >
            <label htmlFor={`seo-${field.name}`} className="form-label">
              {field.label}
            </label>

            {field.multiline ? (
              <textarea
                id={`seo-${field.name}`}
                name={`seo.${field.name}`}
                rows={3}
                value={value[field.name]}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [field.name]: event.target.value,
                  })
                }
                placeholder={field.placeholder}
                className="form-input w-full resize-y"
              />
            ) : (
              <input
                id={`seo-${field.name}`}
                name={`seo.${field.name}`}
                type={field.url ? "url" : "text"}
                value={value[field.name]}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [field.name]: event.target.value,
                  })
                }
                placeholder={field.placeholder}
                className="form-input w-full"
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
        <h3 className="font-semibold text-brand">
          SEO Checklist: {completed}/{checks.length}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted">
          Content suggestions only. This is not a search ranking score.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-foreground">
          {checks.map((check) => (
            <li key={check.label}>
              <span className="font-semibold">
                {check.passed ? "✓ Ready" : "○ Review"}
              </span>
              {" — "}
              {check.label}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-muted">
          Effective title: {title.length} characters · Effective description:{" "}
          {description.length} characters
        </p>
      </div>
    </section>
  );
}