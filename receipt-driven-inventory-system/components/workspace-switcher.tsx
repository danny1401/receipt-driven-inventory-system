"use client";

import {
  Building2Icon,
  CheckIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ALL } from "./util/functions";
import { useWorkspace } from "./workspace";

/**
 * Customer switcher styled like a workspace picker. The selection is shared
 * across pages and scopes the inventory, dashboard, and invoice tables.
 */
export function WorkspaceSwitcher() {
  const { workspace, workspaces, setWorkspace } = useWorkspace();
  const currentLabel = workspace === ALL ? "All customers" : workspace;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="max-w-56 justify-start"
            aria-label={`Switch workspace (current: ${currentLabel})`}
          >
            <Building2Icon className="text-muted-foreground" />
            <span className="min-w-0 truncate" title={currentLabel}>
              {currentLabel}
            </span>
            <ChevronsUpDownIcon className="text-muted-foreground" />
          </Button>
        }
      />

      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setWorkspace(ALL)}>
            <span className="flex-1 truncate">All customers</span>
            {workspace === ALL && <CheckIcon />}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {workspaces === undefined && (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">
                Loading workspaces…
              </span>
            </DropdownMenuItem>
          )}

          {workspaces?.length === 0 && (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">No customers yet</span>
            </DropdownMenuItem>
          )}

          {workspaces?.map((name) => (
            <DropdownMenuItem key={name} onClick={() => setWorkspace(name)}>
              <span className="flex-1 truncate" title={name}>
                {name}
              </span>
              {workspace === name && <CheckIcon />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
