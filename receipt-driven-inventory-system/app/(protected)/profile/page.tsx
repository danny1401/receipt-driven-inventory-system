"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useQuery } from "convex/react";
import { useTheme } from '@teispace/next-themes';
import {
  BadgeCheckIcon,
  CheckIcon,
  CopyIcon,
  LinkIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { cn } from "cn";
import {
  RestrictedPage,
  SectionHeader,
  UserAvatar,
} from "@/components/custom";
import { DeleteAccountDialog } from "@/components/dialog/delete-account-dialog";
import { AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/structure";
import { SignOutButton } from "@/components/custom/signout-button";

const FIELD_LABEL =
  "text-[11px] font-medium tracking-wide text-muted-foreground uppercase";

const THEMES = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: "Owner" | "Admin" | "Member";
  isYou?: boolean;
  pending?: boolean;
};

/** Stand-in collaborators until the workspace backend exists. */
const MOCK_COLLABORATORS: WorkspaceMember[] = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    email: "maya.chen@example.com",
    role: "Admin",
  },
  {
    id: "diego-alvarez",
    name: "Diego Alvarez",
    email: "diego.alvarez@example.com",
    role: "Member",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    role: "Member",
    pending: true,
  },
];

const memberSinceFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** The theme is only known in the browser, so re-render once after hydration. */
const subscribeToHydration = () => () => {};
const isHydrated = () => true;
const isNotHydrated = () => false;

/** `createdAt` is a custom claim on the identity, so its type is unknown. */
function formatMemberSince(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : memberSinceFormatter.format(date);
}

const Page = () => {
  const user = useQuery(api.auth.getCurrentUser);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    isHydrated,
    isNotHydrated,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  if (user === undefined) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </PageContainer>
    );
  }

  if (user === null) {
    return <RestrictedPage content="Your profile" />;
  }

  const displayName =
    user.name?.trim() || user.email?.split("@")[0] || "Your account";
  const memberSince = formatMemberSince(user.createdAt);
  const activeTheme = mounted ? theme : undefined;

  const workspaceMembers: WorkspaceMember[] = [
    {
      id: "you",
      name: displayName,
      email: user.email ?? "No email on file",
      imageUrl: user.pictureUrl,
      role: "Owner",
      isYou: true,
    },
    ...MOCK_COLLABORATORS,
  ];
  const pendingCount = workspaceMembers.filter(
    (member) => member.pending,
  ).length;
  const inviteLink = mounted
    ? `${window.location.origin}/join/ws-8f3a2c91`
    : "/join/ws-8f3a2c91";

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
    } catch {
      // The input stays selectable when the clipboard is blocked.
    }
  };

  return (
    <>
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Your account details, appearance, and account controls.
          </p>
        </div>

        <section className="rounded-xl bg-card ring-1 ring-foreground/10">
          <SectionHeader
            title="Profile information"
            description="The account that owns your receipts and stock."
          />

          <div className="flex flex-col gap-6 px-5 py-5">
            <div className="flex items-center gap-4">
              <UserAvatar
                name={displayName}
                email={user.email}
                imageUrl={user.pictureUrl}
                className="size-14"
                textClassName="text-base"
              />

              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-lg font-semibold tracking-tight">
                  {displayName}
                </span>

                <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate">
                    {user.email ?? "No email on file"}
                  </span>

                  {user.emailVerified ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <BadgeCheckIcon className="size-3.5" />
                      Verified
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <dl className="grid gap-x-6 gap-y-4 border-t border-border/60 pt-5 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-1">
                <dt className={FIELD_LABEL}>Full name</dt>
                <dd className="truncate text-sm font-medium">{displayName}</dd>
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <dt className={FIELD_LABEL}>Email address</dt>
                <dd className="truncate text-sm font-medium">
                  {user.email ?? "—"}
                </dd>
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <dt className={FIELD_LABEL}>Member since</dt>
                <dd className="truncate text-sm font-medium tabular-nums">
                  {memberSince ?? "—"}
                </dd>
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <dt className={FIELD_LABEL}>Status</dt>
                <dd className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="rounded-xl bg-card ring-1 ring-foreground/10">
          <SectionHeader
            title="Workspace"
            description="The people who can add receipts and manage stock with you."
          />

          <div className="flex flex-col gap-5 px-5 py-5">
            <div className="flex items-center gap-3">
              <AvatarGroup>
                {workspaceMembers.map((member) => (
                  <UserAvatar
                    key={member.id}
                    name={member.name}
                    email={member.email}
                    imageUrl={member.imageUrl}
                    className={cn("size-8", member.pending && "opacity-60")}
                  />
                ))}
              </AvatarGroup>

              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {workspaceMembers.length} people
                </span>
                <span className="text-xs text-muted-foreground">
                  {pendingCount === 0
                    ? "Everyone has joined."
                    : `${pendingCount} invite${pendingCount === 1 ? "" : "s"} pending.`}
                </span>
              </div>
            </div>

            <ul className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
              {workspaceMembers.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <UserAvatar
                    name={member.name}
                    email={member.email}
                    imageUrl={member.imageUrl}
                    className={cn("size-8", member.pending && "opacity-60")}
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
                      <span className="truncate">{member.name}</span>
                      {member.isYou ? (
                        <span className="shrink-0 text-xs font-normal text-muted-foreground">
                          (you)
                        </span>
                      ) : null}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>

                  {member.pending ? (
                    <Badge variant="outline" className="text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge
                      variant={
                        member.role === "Owner" ? "secondary" : "outline"
                      }
                    >
                      {member.role}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <LinkIcon className="size-3.5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Invite with link</span>
                  <span className="text-xs text-muted-foreground">
                    Anyone with this link can request to join the workspace.
                  </span>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Input
                  readOnly
                  aria-label="Workspace invite link"
                  value={inviteLink}
                  onFocus={(event) => event.currentTarget.select()}
                  className="h-8 min-w-0 flex-1 bg-background text-xs sm:w-52 sm:flex-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyInviteLink}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-card ring-1 ring-foreground/10">
          <SectionHeader
            title="Appearance"
            description="Choose how the interface looks on this device."
          />

          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Theme</span>
              <span className="text-xs text-muted-foreground">
                Saved in this browser.
              </span>
            </div>

            <div
              role="group"
              aria-label="Theme"
              className="inline-flex w-fit items-center gap-0.5 rounded-lg bg-muted p-0.5"
            >
              {THEMES.map(({ value, label, icon: Icon }) => {
                const isActive = activeTheme === value;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      isActive
                        ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-card ring-1 ring-foreground/10">
          <SectionHeader
            title="Danger zone"
            description="Permanent actions that cannot be undone."
          />
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Sign out</span>
              <span className="text-xs text-muted-foreground">
                Signs you out of your account.
              </span>
            </div>

            <SignOutButton />
          </div>

          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Delete account</span>
              <span className="text-xs text-muted-foreground">
                Signs you out and permanently closes your account.
              </span>
            </div>

            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2Icon />
              Delete account
            </Button>
          </div>
        </section>
      </div>

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        email={user.email}
      />
    </>
  );
};

export default Page;
