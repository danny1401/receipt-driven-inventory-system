import { PageContainer } from "@/components/custom"; 

export const RestrictedPage = ({ content }:{ content: string }) => {
  return (
    <PageContainer>
      <div className="flex flex-col h-screen justify-center items-center rounded-xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
        <p className="font-medium">You need to sign in.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {content} is only available to existing accounts.
        </p>
      </div>
    </PageContainer>
  );
}
