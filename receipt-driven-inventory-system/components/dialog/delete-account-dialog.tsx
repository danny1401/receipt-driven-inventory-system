"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";

import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AuthError = {
  code?: string;
  message?: string;
};

function getDeleteErrorMessage({ code, message }: AuthError) {
  switch (code) {
    case "INVALID_PASSWORD":
      return "That password is incorrect.";
    case "SESSION_EXPIRED":
    case "SESSION_NOT_FRESH":
      return "Your session is too old to confirm this. Sign out, sign back in, and try again.";
    case "CREDENTIAL_ACCOUNT_NOT_FOUND":
      return "This account doesn’t use a password. Sign out, sign back in, and try again.";
    default:
      return message ?? "Unable to delete your account right now. Please try again.";
  }
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  email,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  /**
   * `null` while we check whether the account has a password (credential)
   * sign-in, because Google-only accounts have nothing to confirm with.
   */
  const [usesPassword, setUsesPassword] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    authClient
      .listAccounts()
      .then(({ data }) => {
        if (cancelled) return;

        setUsesPassword(
          (data ?? []).some((account) => account.providerId === "credential"),
        );
      })
      .catch((listError) => {
        if (cancelled) return;

        console.error("Unable to list accounts:", listError);
        setUsesPassword(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting) return;

    if (!nextOpen) {
      setPassword("");
      setError(null);
    }

    onOpenChange(nextOpen);
  };

  const handleDelete = async () => {
    if (usesPassword && password.length === 0) {
      setError("Enter your password to confirm.");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { error: deleteError } = await authClient.deleteUser({
        ...(usesPassword ? { password } : {}),
        callbackURL: "/",
      });

      if (deleteError) {
        setError(getDeleteErrorMessage(deleteError));
        setIsDeleting(false);
        return;
      }

      // The account is gone, so this may fail; either way the session is over.
      await authClient.signOut().catch(() => {});

      onOpenChange(false);
      router.push("/");
      router.refresh();
    } catch (deleteError) {
      console.error("Error deleting account:", deleteError);
      setError("Unable to delete your account right now. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">
              {email ?? "your account"}
            </span>{" "}
            and signs you out. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {usesPassword ? (
          <Field data-invalid={Boolean(error) || undefined}>
            <FieldLabel htmlFor="delete-account-password">Password</FieldLabel>
            <Input
              id="delete-account-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(null);
              }}
              aria-invalid={Boolean(error)}
              disabled={isDeleting}
            />
            <FieldError>{error}</FieldError>
          </Field>
        ) : usesPassword === null ? (
          <p className="text-xs text-muted-foreground">
            Checking how you sign in…
          </p>
        ) : (
          <FieldError>{error}</FieldError>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || usesPassword === null}
            aria-busy={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete account"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
