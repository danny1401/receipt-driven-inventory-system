"use client";

import { authClient } from "@/lib/authClient";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={async () => {
          await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
          });
        }}
      >
        Sign in with GitHub
      </button>
    </div>
  );
};

export default Page;