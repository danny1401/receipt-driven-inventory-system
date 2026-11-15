import { getToken } from "@/lib/authServer";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/authServer";
import { AuthGuard } from "../../components/structure";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  if (!token) {
    redirect('/login');
  }
  
  const preloadedUserQuery = await preloadAuthQuery(api.auth.getCurrentUser);
  return (
    <AuthGuard preloadedUserQuery={preloadedUserQuery}>
      {children}
    </AuthGuard>
  );
};
