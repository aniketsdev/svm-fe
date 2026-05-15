interface PlaceholderPageProps {
  title: string;
}

/**
 * Used for routes whose feature is not yet implemented on this branch.
 * Keeps the route map navigable end-to-end so QA and reviewers can verify
 * the route guards + protected shell render correctly.
 */
export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This page is not yet implemented. The route exists so the protected
        shell and route guards can be exercised end-to-end.
      </p>
    </div>
  );
}
