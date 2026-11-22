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
import { useWorkspace } from "./workspace";

const STORAGE_KEY = "receipt-driven-inventory:month";
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

type MonthContextValue = {
  /** Selected month in `YYYY-MM` form, or `ALL` for every month. */
  month: string;
  /** Months that contain invoices, newest first, once loaded. */
  months: string[] | undefined;
  setMonth: (month: string) => void;
};

const MonthContext = createContext<MonthContextValue | null>(null);

/** The stored selection, mirrored in memory so every subscriber sees it. */
let currentMonth: string | null = null;
const listeners = new Set<() => void>();

function readStoredMonth() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked (for example in private browsing).
    return null;
  }
}

function normalizeMonth(value: string | null) {
  return value && (value === ALL || MONTH_PATTERN.test(value)) ? value : ALL;
}

function getSnapshot() {
  if (typeof window === "undefined") return ALL;

  if (currentMonth === null) {
    currentMonth = normalizeMonth(readStoredMonth());
  }

  return currentMonth;
}

function getServerSnapshot() {
  return ALL;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep other tabs in sync with the same month.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    currentMonth = normalizeMonth(event.newValue);
    listener();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function storeMonth(next: string) {
  currentMonth = normalizeMonth(next);

  try {
    window.localStorage.setItem(STORAGE_KEY, currentMonth);
  } catch {
    // The selection still applies for this session if storage is blocked.
  }

  listeners.forEach((listener) => listener());
}

export function MonthProvider({ children }: { children: ReactNode }) {
  const activePeriods = useQuery(api.inventory.inventory.getActivePeriods);
  
  const months = useMemo(
    () =>
      activePeriods?.map(
        ({ year, month }) => `${year}-${String(month).padStart(2, "0")}`,
      ),
    [activePeriods],
  );

  const selected = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setMonth = useCallback((next: string) => {
    storeMonth(next);
  }, []);

  const value = useMemo(
    () => ({ month: selected, months, setMonth }),
    [selected, months, setMonth],
  );

  return (
    <MonthContext.Provider value={value}>{children}</MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);

  if (!context) {
    throw new Error("useMonth must be used within a MonthProvider");
  }

  return context;
}
