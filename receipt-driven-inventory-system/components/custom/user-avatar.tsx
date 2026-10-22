import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Falls back to the initials of the name, or the local part of the email, when
 * no profile picture is available.
 */
function getInitials(name: string | undefined, email: string | undefined) {
  const source = name?.trim() || email?.split("@")[0] || "";
  const initials = source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials.toUpperCase() || "?";
}

export function UserAvatar({
  name,
  email,
  imageUrl,
  className,
  textClassName,
}: {
  name?: string;
  email?: string;
  /** Profile picture URL, when the identity includes one. */
  imageUrl?: string;
  className?: string;
  textClassName?: string;
}) {
  return (
    <Avatar className={cn("size-9", className)}>
      {imageUrl ? <AvatarImage src={imageUrl} alt="" /> : null}
      <AvatarFallback
        className={cn(
          "bg-primary/10 text-xs font-medium text-primary",
          textClassName,
        )}
      >
        {getInitials(name, email)}
      </AvatarFallback>
    </Avatar>
  );
}
