"use client";

import { LoginForm } from "@/components/custom";
import { signInWithGoogle } from "@/convex/betterAuth/authClient";

const Page = () => {
  const handleSignIn = async () => {
    try {
      // Sign up the user with Better Auth
      await signInWithGoogle();

    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="flex min-h-[calc(100svh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="m-auto w-full max-w-sm">
        <LoginForm onGoogleSignIn={handleSignIn} />
      </div>
    </div>
  );
};

export default Page;
