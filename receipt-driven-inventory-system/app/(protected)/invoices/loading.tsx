import { PageContainer } from "@/components/structure";

export default function Loading() {
  return (
    <PageContainer>
      {/* Put your loading skeleton JSX here */}
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-64 w-full rounded bg-muted" />
        yet to build
      </div>
    </PageContainer>
  );
}