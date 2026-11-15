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
import { ALL } from "./util/functions";

const STORAGE_KEY = "receipt-driven-inventory:workspace";

type WorkspaceContextValue = {
  /** Selected customer name, or `ALL` for every customer. */
  workspace: string;
  /** Customer names from the database, once loaded. */
  workspaces: string[] | undefined;
  setWorkspace: (workspace: string) => void;
};

// Create the React Context for sharing workspace state across components
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

// The stored selection, mirrored in memory so every subscriber sees it.
let currentWorkspace: string | null = null;
// Set of listener functions notified whenever the workspace selection changes
const listeners = new Set<() => void>();

// Safely attempts to read the stored workspace from browser localStorage
function readStoredWorkspace() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked (for example in private browsing).
    return null;
  }
}

// Ensures a valid value is returned; defaults to ALL if the input is null/empty
function normalizeWorkspace(value: string | null) {
  return value ? value : ALL;
}

// Returns the current snapshot of the workspace state for useSyncExternalStore
function getSnapshot() {
  // Fallback for Server-Side Rendering (SSR) where window is undefined
  if (typeof window === "undefined") return ALL;

  // Lazily initialize currentWorkspace from localStorage on first read
  if (currentWorkspace === null) {
    currentWorkspace = normalizeWorkspace(readStoredWorkspace());
  }

  return currentWorkspace;
}

// Returns the default workspace value when rendering on the server
function getServerSnapshot() {
  return ALL;
}

// Subscribes components to updates when the workspace changes
function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep other browser tabs in sync with the same workspace selection
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    currentWorkspace = normalizeWorkspace(event.newValue);
    listener(); // Notify subscribers of the change from another tab
  };

  window.addEventListener("storage", onStorage);

  // Cleanup function removing the listener and event listener
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Updates the current workspace in memory, localStorage, and notifies all listeners
function storeWorkspace(next: string) {
  currentWorkspace = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The selection still applies for this session if storage is blocked.
  }

  // Trigger re-render or updates for all subscribed components
  listeners.forEach((listener) => listener());
}

// Provider component that wraps parts of the app requiring workspace state
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const workspaces = useQuery(api.inventory.inventory.listWorkspaces);

  // Bridge external mutable storage into React's reactive state system safely
  const selected = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Fallback check: if a selected workspace was deleted/removed from the DB, reset to ALL
  const workspace =
    workspaces && selected !== ALL && !workspaces.includes(selected)
      ? ALL
      : selected;

  // Memoized setter function to change the active workspace
  const setWorkspace = useCallback((next: string) => {
    storeWorkspace(next);
  }, []);

  // Memoize the context value object to prevent unnecessary re-renders of consumers
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
