import { SignupForm } from "@/components/custom"

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  )
}
