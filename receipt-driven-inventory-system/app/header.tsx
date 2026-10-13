"use client";

import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import type { Preloaded } from "convex/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import type { api } from "@/convex/_generated/api";

export const Header = ({
  preloadedUserQuery,
}: {
  preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}) => {
  const user = usePreloadedAuthQuery(preloadedUserQuery);
  return (
    <div>
      {user ? (
        <button>
          
          <Link href="/dashboard">Dashboard</Link>
        </button>
      ) : (
        <button>
          <Link href="/sign-in">Sign in</Link>
        </button>
      )}
    </div>
  );
};

export default Header;