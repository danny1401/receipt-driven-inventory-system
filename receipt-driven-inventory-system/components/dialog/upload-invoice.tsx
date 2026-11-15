"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQueries, useQuery } from "convex/react";

import { cn } from "cn";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import {
  Building2Icon,
  CheckIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  ImageIcon,
  LoaderCircleIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { ALL } from "../util/functions";
import { useWorkspace } from "../workspace";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type UploadStatus = "idle" | "uploading" | "processing" | "done" | "error";

type UploadEntry = {
  id: string;
  file: File;
  status: UploadStatus;
  error?: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/heic",
    "image/heif",
  ];
  const allowedExts = [".pdf", ".png", ".jpg", ".jpeg", ".heic", ".heif"];

  const fileName = file.name.toLowerCase();
  const isValid =
    allowedTypes.includes(file.type) ||
    allowedExts.some((ext) => fileName.endsWith(ext));

  if (!isValid) return "Only PDF and image files are supported.";
  if (file.size > MAX_FILE_SIZE) return "File is larger than 10 MB.";

  return null;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function describeEntry(entry: UploadEntry) {
  switch (entry.status) {
    case "idle":
      return `${formatFileSize(entry.file.size)} · Ready to upload`;
    case "uploading":
      return "Uploading…";
    case "processing":
      return "Extracting line items…";
    case "done":
      return `${formatFileSize(entry.file.size)} · Uploaded`;
    case "error":
      return entry.error ?? "Something went wrong.";
  }
}

interface UploadInvoiceProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpload?: (file: File) => Promise<void> | void;
}

export function UploadInvoice({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onUpload,
}: UploadInvoiceProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] =
    useState<Id<"customers"> | null>(null);
  const { workspace } = useWorkspace();
  const dragDepth = useRef(0);
  const router = useRouter();

  const isOpen = externalOpen ?? internalOpen;
  const setIsOpen = externalOnOpenChange ?? setInternalOpen;

  // Convex Queries and Mutations
  const generateUploadUrl = useMutation(
    api.inventory.invoices.generateUploadUrl,
  );
  const uploadInvoice = useMutation(api.inventory.invoices.uploadInvoice);

  // The customer ids this signed-in user can upload invoices for.
  const customerIds = useQuery(
    api.inventory.customers.getCustomerIdsByBetterAuthId,
  );

  // Dynamically build a request map to fetch details for each customer ID in parallel
  const customerRequests = useMemo(
    () =>
      Object.fromEntries(
        (customerIds ?? []).map((customerId) => [
          customerId,
          {
            query: api.inventory.customers.getCustomerById,
            args: { customerId },
          },
        ]),
      ),
    [customerIds],
  );

  // Execute all customer queries concurrently using Convex's useQueries hook
  const customerResults = useQueries(customerRequests) as Record<
    string,
    Doc<"customers"> | null | undefined | Error
  >;

  // Filter out loading states or errors, extract valid customer documents, and sort alphabetically by name
  const customers = useMemo(
    () =>
      (customerIds ?? [])
        .map((customerId) => customerResults[customerId])
        .filter(
          (customer): customer is Doc<"customers"> =>
            customer !== null &&
            customer !== undefined &&
            !(customer instanceof Error),
        )
        .sort((a, b) => a.customerName.localeCompare(b.customerName)),
    [customerIds, customerResults],
  );

  // True if customer data is still being fetched from the server
  const customersLoading =
    customerIds === undefined ||
    customerIds.some((customerId) => customerResults[customerId] === undefined);

  // Determine the active customer using a fallback hierarchy:
  // 1. Explicitly selected customer -> 2. Customer matching current workspace name -> 3. First available customer -> 4. null
  const selectedCustomer =
    customers.find((customer) => customer._id === selectedCustomerId) ??
    customers.find(
      (customer) => workspace !== ALL && customer.customerName === workspace,
    ) ??
    customers[0] ??
    null;
  
  const cannotUpload = entries.length === 0 || entries.every((e) => e.status !== "idle");

  // Count how many files are waiting to be uploaded
  const pendingCount = entries.filter(
    (entry) => entry.status === "idle",
  ).length;

  // ==========================================
  // HELPER FUNCTIONS (ENTRY MANAGEMENT)
  // ==========================================

  // Utility to update a specific file entry's state (e.g., status, progress, error messages)
  const updateEntry = (id: string, patch: Partial<UploadEntry>) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    );
  };

  // Adds files from file input or drag-and-drop to the queue, 
  // checking for duplicates and running validation
  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;

    const incoming = Array.from(list);

    setEntries((current) => {
      // Create a set of already-added files based on name and size to prevent duplicates
      const seen = new Set(
        current.map((entry) => `${entry.file.name}:${entry.file.size}`),
      );

      const next = incoming
        .filter((file) => !seen.has(`${file.name}:${file.size}`))
        .map<UploadEntry>((file) => {
          const error = validateFile(file);
          return {
            id: crypto.randomUUID(),
            file,
            status: error ? "error" : "idle",
            error: error ?? undefined,
          };
        });

      return [...current, ...next];
    });
  };

  // Removes a file entry from the queue by its unique ID
  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  // ==========================================
  // UPLOAD EXECUTION LOGIC
  // ==========================================

  const runUpload = async (
    entry: UploadEntry,
    customerId: Id<"customers"> | null,
  ) => {
    // Mark entry as currently uploading and clear previous errors
    updateEntry(entry.id, { status: "uploading", error: undefined });

    try {
      if (onUpload) {
        // If a custom upload handler was passed via props, use that
        await onUpload(entry.file);
      } else {
        // Standard Convex storage upload flow:
        // 1. Get a temporary secure upload URL from Convex storage
        const postUrl = await generateUploadUrl();

        // 2. Perform a direct POST request with the raw file data
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": entry.file!.type },
          body: entry.file,
        });
        const { storageId } = await result.json();

        // 3. Save the invoice record linking the storage ID and customer ID in the database
        await uploadInvoice({
          storageId,
          fileName: entry.file.name,
          ...(customerId ? { customerId } : {}),
        });

        // Small simulated delay for UI smoothness
        await delay(700);
      }

      // Mark status as processing (server-side background extraction is running)
      updateEntry(entry.id, { status: "processing" });

      // Trigger a toast notification informing the user of successful upload
      toast.add({
        title: "Invoice uploaded",
        description: (
          <>
            <span
              className="block truncate font-medium text-foreground"
              title={entry.file.name}
            >
              {entry.file.name}
            </span>
            <span>
              is being processed. You can follow the progress and result in
              Invoices.
            </span>
          </>
        ),
        type: "info",
        actionProps: {
          children: "View invoices",
          onClick: () => router.push("/invoices"),
        },
      });

      await delay(onUpload ? 600 : 1000);
      updateEntry(entry.id, { status: "done" });
    } catch {
      updateEntry(entry.id, {
        status: "error",
        error: "Upload failed. Please try again.",
      });
    }
  };

  // Triggers upload for all pending ("idle") files in the queue
  const startUpload = () => {
    const customerId = selectedCustomer?._id;

    entries
      .filter((entry) => entry.status === "idle")
      .forEach((entry) => {
        void runUpload(entry, customerId);
      });
  };

  // ==========================================
  // DRAG & DROP EVENT HANDLERS
  // ==========================================

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        setIsOpen(next);
        if (!next) {
          setEntries([]);
          setIsDragging(false);
          dragDepth.current = 0;
        }
      }}
    >
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload invoice</DialogTitle>
          <DialogDescription>
            Drag and drop a supplier invoice as a PDF or image, or browse your
            files.
          </DialogDescription>
        </DialogHeader>

        {!customersLoading && customers.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Customer</span>
              <span className="text-xs text-muted-foreground">
                Upload destination
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled={!customersLoading && customers.length === 0}
                    aria-label={`Choose customer (current: ${
                      selectedCustomer?.customerName ?? "none"
                    })`}
                  >
                    <Building2Icon className="text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-left">
                      {selectedCustomer?.customerName ?? "Select customer"}
                    </span>
                    <ChevronsUpDownIcon className="text-muted-foreground" />
                  </Button>
                }
              />

              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Customers</DropdownMenuLabel>

                  {customersLoading && customers.length === 0 && (
                    <DropdownMenuItem disabled>
                      <span className="text-muted-foreground">
                        Loading customers…
                      </span>
                    </DropdownMenuItem>
                  )}

                  {!customersLoading && customers.length === 0 && (
                    <DropdownMenuItem disabled>
                      <span className="text-muted-foreground">
                        No customers available
                      </span>
                    </DropdownMenuItem>
                  )}

                  {customers.map((customer) => (
                    <DropdownMenuItem
                      key={customer._id}
                      onClick={() => setSelectedCustomerId(customer._id)}
                    >
                      <span
                        className="flex-1 truncate"
                        title={customer.customerName}
                      >
                        {customer.customerName}
                      </span>
                      {selectedCustomer?._id === customer._id && <CheckIcon />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <p className="text-xs text-muted-foreground">
              The invoice and its line items will be added to this customer.
            </p>
          </div>
        )}
        

        <label
          onDragEnter={handleDragEnter}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-8 text-center transition-colors",
            "hover:border-foreground/20 hover:bg-muted/50",
            "has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
            isDragging && "border-primary bg-muted/60 ring-3 ring-ring/30",
          )}
        >
          <input
            type="file"
            multiple
            accept="application/pdf,image/*"
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />

          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-background text-foreground ring-1 ring-border/60">
            <UploadIcon className="size-5" />
          </span>

          <span className="text-sm font-medium">
            {isDragging ? "Drop receipts to upload" : "Drag and drop receipts"}
          </span>
          <span className="text-xs text-muted-foreground">
            PDF or image · up to 10 MB each
          </span>
          <span className="mt-2 text-xs font-medium underline underline-offset-3">
            Browse files
          </span>
        </label>

        {entries.length > 0 && (
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            {entries.map((entry) => {
              const isBusy =
                entry.status === "uploading" || entry.status === "processing";

              return (
                <Attachment
                  key={entry.id}
                  state={entry.status}
                  className="w-full"
                >
                  <AttachmentMedia>
                    {isBusy ? (
                      <LoaderCircleIcon
                        data-slot="spinner"
                        className="animate-spin"
                      />
                    ) : entry.file.type.startsWith("image/") ? (
                      <ImageIcon />
                    ) : (
                      <FileTextIcon />
                    )}
                  </AttachmentMedia>

                  <AttachmentContent>
                    <AttachmentTitle>{entry.file.name}</AttachmentTitle>
                    <AttachmentDescription>
                      {describeEntry(entry)}
                    </AttachmentDescription>
                  </AttachmentContent>

                  <AttachmentActions>
                    <AttachmentAction
                      aria-label={`Remove ${entry.file.name}`}
                      disabled={entry.status === "uploading"}
                      onClick={() => removeEntry(entry.id)}
                    >
                      <XIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            disabled={pendingCount === 0 || cannotUpload}
            onClick={startUpload}
          >
            <UploadIcon />
            {pendingCount > 1 ? `Upload ${pendingCount} files` : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
