"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { ALL } from "./filter";

const STORAGE_KEY = "receipt-driven-inventory:workspace";

type WorkspaceContextValue = {
  /** Selected customer name, or `ALL` for every customer. */
  workspace: string;
  /** Customer names from the database, once loaded. */
  workspaces: string[] | undefined;
  setWorkspace: (workspace: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/** The stored selection, mirrored in memory so every subscriber sees it. */
let currentWorkspace: string | null = null;
const listeners = new Set<() => void>();

function readStoredWorkspace() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked (for example in private browsing).
    return null;
  }
}

function normalizeWorkspace(value: string | null) {
  return value ? value : ALL;
}

function getSnapshot() {
  if (typeof window === "undefined") return ALL;

  if (currentWorkspace === null) {
    currentWorkspace = normalizeWorkspace(readStoredWorkspace());
  }

  return currentWorkspace;
}

function getServerSnapshot() {
  return ALL;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep other tabs in sync with the same workspace.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    currentWorkspace = normalizeWorkspace(event.newValue);
    listener();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function storeWorkspace(next: string) {
  currentWorkspace = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The selection still applies for this session if storage is blocked.
  }

  listeners.forEach((listener) => listener());
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const workspaces = useQuery(api.inventory.inventory.listWorkspaces);
  const selected = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // A stored workspace can disappear when its customer is removed.
  const workspace =
    workspaces && selected !== ALL && !workspaces.includes(selected)
      ? ALL
      : selected;

  const setWorkspace = useCallback((next: string) => {
    storeWorkspace(next);
  }, []);

  const value = useMemo(
    () => ({ workspace, workspaces, setWorkspace }),
    [workspace, workspaces, setWorkspace],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }

  return context;
}
