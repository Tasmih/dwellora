type ServiceCardProps = {
  service: {
    _id: string;
    title: string;
    description: string;
    image: string;
    status: "published" | "unpublished";
  };
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const published = service.status === "published";

  return (
    <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
      
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-brand">
          {service.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted">
          {service.description}
        </p>
      </div>


      <div className="flex flex-wrap items-center gap-3">

        <span
          className={
            published
              ? "rounded-full bg-brand px-4 py-1.5 text-xs font-medium text-white"
              : "rounded-full bg-border px-4 py-1.5 text-xs font-medium text-muted"
          }
        >
          {service.status}
        </span>


        <button className="btn btn-secondary">
          Edit
        </button>


        <button className="btn border border-border text-brand hover:bg-brand hover:text-white">
          Delete
        </button>

      </div>

    </div>
  );
}