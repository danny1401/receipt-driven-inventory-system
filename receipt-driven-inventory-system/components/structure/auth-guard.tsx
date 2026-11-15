"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { WorkspaceProvider } from "@/components/workspace";
import { MonthProvider } from "@/components/month";
import { Footer, Header, PageContainer } from "../../components/structure";
import { FunctionReturnType } from "convex/server";
import { redirect } from "next/navigation";

type User = NonNullable<FunctionReturnType<typeof api.auth.getCurrentUser>>;

const UserContext = createContext<User | null>(null);

export function useUser() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within ProtectedShell");
  }
  return user;
}

interface AuthGuardProps {
  children: React.ReactNode;
  preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}

export function AuthGuard({ children, preloadedUserQuery }: AuthGuardProps) {
  const user = usePreloadedQuery(preloadedUserQuery);
  const ensureUser = useMutation(api.inventory.users.ensureUser);
  const hasSyncedRef = useRef(false);

  // This will run once when the user enters the layout
  useEffect(() => {
    if (!user || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    ensureUser().catch((err) => {
      hasSyncedRef.current = false;
      console.error("Failed to sync user:", err);
    });
  }, [user, ensureUser]);

  if (user === undefined) {
    return null;
  }

  if (user === null) {
    return redirect("/login");
  }

  return (
    <UserContext.Provider value={user}>
      <WorkspaceProvider>
        <MonthProvider>
          <Header preloadedUserQuery={preloadedUserQuery} />
            <main className="flex-1 flex flex-col">
              <PageContainer>{children}</PageContainer>
            </main>
          <Footer />
        </MonthProvider>
      </WorkspaceProvider>
    </UserContext.Provider>
  );
}
export default AuthGuard;
