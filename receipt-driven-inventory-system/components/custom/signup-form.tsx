"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/authClient"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Better Auth enforces a minimum of 8 characters on sign up.
const MIN_PASSWORD_LENGTH = 8

type FieldName = "name" | "email" | "password" | "confirmPassword"

type AuthError = {
  code?: string
  message?: string
}

function getSignUpErrorMessage(error: unknown) {
  const { code, message } = (error ?? {}) as AuthError

  switch (code) {
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
    case "USER_ALREADY_EXISTS":
      return "An account with this email already exists. Try logging in instead."
    case "INVALID_EMAIL":
      return "Enter a valid email address."
    case "INVALID_PASSWORD":
      return "Enter a valid password."
    case "PASSWORD_TOO_SHORT":
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    case "PASSWORD_TOO_LONG":
      return "That password is too long."
    case "EMAIL_PASSWORD_SIGN_UP_DISABLED":
      return "Account creation is currently unavailable."
    default:
      return (
        message ?? "Unable to create your account right now. Please try again."
      )
  }
}

export function SignupForm({
  className,
  callbackURL = "/dashboard",
  ...props
}: React.ComponentProps<"div"> & {
  callbackURL?: string
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldName, string>>
  >({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const errors: Partial<Record<FieldName, string>> = {}

    if (!name.trim()) {
      errors.name = "Full name is required."
    }

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      errors.email = "Email is required."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      errors.email = "Enter a valid email address."
    }

    if (!password) {
      errors.password = "Password is required."
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password."
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match."
    }

    return errors
  }

  function updateField(field: FieldName, value: string) {
    if (field === "name") {
      setName(value)
    } else if (field === "email") {
      setEmail(value)
    } else if (field === "password") {
      setPassword(value)
    } else {
      setConfirmPassword(value)
    }

    // Clear the field error (and any stale sign-up error) as the user types.
    setFieldErrors((previous) => {
      const hasFieldError = Boolean(previous[field])
      const hasStaleMatchError =
        field === "password" && Boolean(previous.confirmPassword)
      if (!hasFieldError && !hasStaleMatchError) return previous

      const next = { ...previous }
      delete next[field]
      // Editing the password can resolve a stale "Passwords do not match".
      if (field === "password") delete next.confirmPassword
      return next
    })
    setFormError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError(null)
      return
    }

    setFieldErrors({})
    setFormError(null)
    setIsSubmitting(true)

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL,
      })

      if (error) {
        setFormError(getSignUpErrorMessage(error))
        return
      }

      // Signing up also signs the user in, so continue into the app.
      router.push(callbackURL)
      router.refresh()
    } catch (error) {
      console.error("Error during sign up:", error)
      setFormError("Unable to create your account right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Sign up</h1>
            <FieldDescription>
              Already have an account? <a href="/log-in">Log in</a>
            </FieldDescription>
          </div>

          <Field data-invalid={Boolean(fieldErrors.name) || undefined}>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="py-5"
              placeholder="John Doe"
              value={name}
              onChange={(event) => updateField("name", event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              disabled={isSubmitting}
              required
            />
            <FieldError id="name-error">{fieldErrors.name}</FieldError>
          </Field>

          <Field data-invalid={Boolean(fieldErrors.email) || undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="py-5"
              placeholder="m@example.com"
              value={email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              disabled={isSubmitting}
              required
            />
            <FieldError id="email-error">{fieldErrors.email}</FieldError>
          </Field>

          <Field data-invalid={Boolean(fieldErrors.password) || undefined}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="py-5"
              placeholder="••••••••"
              value={password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password
                  ? "password-error password-hint"
                  : "password-hint"
              }
              disabled={isSubmitting}
              required
            />
            <FieldError id="password-error">{fieldErrors.password}</FieldError>
            <FieldDescription id="password-hint">
              Must be at least {MIN_PASSWORD_LENGTH} characters long.
            </FieldDescription>
          </Field>

          <Field
            data-invalid={Boolean(fieldErrors.confirmPassword) || undefined}
          >
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              className="py-5"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              disabled={isSubmitting}
              required
            />
            <FieldError id="confirm-password-error">
              {fieldErrors.confirmPassword}
            </FieldError>
          </Field>

          <FieldError id="form-error">{formError}</FieldError>

          <Field>
            <Button
              type="submit"
              className="py-5"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
