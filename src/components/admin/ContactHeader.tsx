type ContactHeaderProps = {
  totalCount?: number;
  newCount?: number;
};

export default function ContactHeader({
  totalCount = 0,
  newCount = 0,
}: ContactHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Lead Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand sm:text-3xl">
          Client Messages &amp; Inquiries
        </h1>

        <p className="mt-1 text-sm text-muted">
          Review consultation requests, track inquiries, and update lead statuses.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-border bg-surface px-4 py-2 text-center shadow-sm">
          <span className="block text-xs font-medium text-muted">Total Leads</span>
          <span className="text-lg font-bold text-brand">{totalCount}</span>
        </div>

        {newCount > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-center shadow-sm">
            <span className="block text-xs font-medium text-amber-700">New / Unread</span>
            <span className="text-lg font-bold text-amber-800">{newCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
