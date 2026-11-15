import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

export const signUpWithEmail = async (name: string, email: string, password: string) => {
  const { data, error } = await authClient.signUp.email({
    name: name.trim(),
    email: email.trim(),
    password,
    callbackURL: "/dashboard", // Optional redirect after sign up
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signInWithGoogle = async () => {
  const { data, error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signOut = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        // Optional: Force a hard reload or handle client-side cleanup if needed
        window.location.href = "/sign-in";
      },
    },
  });
};

export const deleteAccount = async (password?: string) => {
  const { data, error } = await authClient.deleteUser({
    // If the user has a password-based account, pass it here if required by your setup
    ...(password ? { password } : {}),
    fetchOptions: {
      onSuccess: () => {
        // Redirect to sign up or home page after account is deleted
        window.location.href = "/sign-up";
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};