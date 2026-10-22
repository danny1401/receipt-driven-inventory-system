"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "cn"
import { Button, Input } from "@/components/ui"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { authClient } from "@/lib/authClient"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Better Auth enforces a minimum of 8 characters on sign up.
const MIN_PASSWORD_LENGTH = 8

type FieldName = "email" | "password"

type AuthError = {
  code?: string
  message?: string
}

function getSignInErrorMessage(error: unknown) {
  const { code, message } = (error ?? {}) as AuthError

  switch (code) {
    // Better Auth returns this same code whether the account does not exist
    // or the password is wrong, so both cases share one generic message.
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Invalid email or password."
    case "INVALID_EMAIL":
      return "Enter a valid email address."
    case "EMAIL_NOT_VERIFIED":
      return "Please verify your email address before logging in."
    case "EMAIL_PASSWORD_DISABLED":
      return "Email and password sign-in is currently unavailable."
    default:
      return message ?? "Unable to log in right now. Please try again."
  }
}

export function LoginForm({
  className,
  onGoogleSignIn,
  callbackURL = "/dashboard",
  ...props
}: React.ComponentProps<"div"> & {
  onGoogleSignIn?: () => void
  callbackURL?: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldName, string>>
  >({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const errors: Partial<Record<FieldName, string>> = {}
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

    return errors
  }

  function updateField(field: FieldName, value: string) {
    if (field === "email") {
      setEmail(value)
    } else {
      setPassword(value)
    }

    // Clear the field error and any stale sign-in error as the user types.
    setFieldErrors((previous) => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
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
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL,
      })

      if (error) {
        setFormError(getSignInErrorMessage(error))
        return
      }

      router.push(data?.url ?? callbackURL)
      router.refresh()
    } catch (error) {
      console.error("Error during log in:", error)
      setFormError("Unable to log in right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Log in</h1>
            <FieldDescription>
              Don&apos;t have an account? <a href="/sign-up">Sign up</a>
            </FieldDescription>
          </div>

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
              autoComplete="current-password"
              className="py-5"
              placeholder="••••••••"
              value={password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              disabled={isSubmitting}
              required
            />
            <FieldError id="password-error">{fieldErrors.password}</FieldError>
          </Field>

          <FieldError id="form-error">{formError}</FieldError>

          <Field>
            <Button
              type="submit"
              className="py-5"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Logging in…" : "Login"}
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>

          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={onGoogleSignIn}
              className="py-5"
              disabled={isSubmitting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
