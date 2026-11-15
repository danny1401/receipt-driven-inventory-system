"use client";

import { signOut } from "@/convex/betterAuth/authClient";
import { useRouter } from "next/navigation"; // or your framework's router
import { Button } from "../ui";
import { LogOutIcon } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in"); // Redirect to your login page
      router.refresh();        // Refresh server components & middleware state
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleSignOut}
    >
      <LogOutIcon />
      Sign Out
    </Button>
  );
}