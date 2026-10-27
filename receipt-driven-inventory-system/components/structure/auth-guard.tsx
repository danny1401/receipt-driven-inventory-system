"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { RestrictedPage } from "@/components/custom";
import { PageContainer } from "@/components/structure";
import { createContext, useContext } from "react";

// Optional: Context to pass the user down without re-fetching
const UserContext = createContext<any>(null);
export const useUser = () => useContext(UserContext);

interface AuthGuardProps {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  restrictedContentName: string;
}

export function AuthGuard({
  children,
  skeleton,
  restrictedContentName,
}: AuthGuardProps) {
  const user = useQuery(api.auth.getCurrentUser);

  if (user === undefined) {
    return <PageContainer>{skeleton}</PageContainer>;
  }

  if (user === null) {
    return <RestrictedPage content={restrictedContentName} />;
  }

  return (
    <UserContext.Provider value={user}>
      <PageContainer>{children}</PageContainer>
    </UserContext.Provider>
  );
}
export default AuthGuard;
