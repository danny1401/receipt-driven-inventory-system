"use client";

import { useState } from "react";
import {
  AddItemDialog,
  UploadInvoice,
  WorkspaceSwitcher,
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRightIcon,
  ClipboardListIcon,
  Download,
  ExternalLink,
  Plus,
  Settings2Icon,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

export function PageHeader({ content }: { content: string }) {
  const [AddItemOpen, setAddItemOpen] = useState(false);
  const [UploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight capitalize">
          {content}
        </h1>
        {content === "dashboard" && (
          <p className="text-sm text-muted-foreground">
            A snapshot of this month&rsquo;s receipts, stock, and open reviews.
          </p>
        )}
        {content === "inventory" && (
          <p className="text-sm text-muted-foreground">
            Every line item captured from your supplier invoices.
          </p>
        )}
        {content === "invoices" && (
          <p className="text-sm text-muted-foreground">
            Supplier invoices, parsed into structured order lines.**
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <WorkspaceSwitcher />

        <Popover>
          <PopoverTrigger render={<Button variant="default" />}>
            <Settings2Icon />
            Options
          </PopoverTrigger>

          <PopoverContent align="end" className="w-52 p-1">
            <div className="flex flex-col gap-0.5">
              {/* Inventory Section */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Inventory
              </div>

              <button
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-left"
                onClick={(e) => {
                  e.preventDefault();
                  setUploadOpen(true);
                }}
              >
                <Upload className="size-4" />
                Upload invoice
              </button>

              <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-left">
                <ArrowLeftRightIcon className="size-4" />
                Replace inventory
              </button>

              <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-left">
                <Download className="size-4" />
                Export inventory
              </button>

              <div className="my-1 h-px bg-border" />

              {/* Item Section */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Item
              </div>

              <button
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-left"
                onClick={(e) => {
                  e.preventDefault();
                  setAddItemOpen(true);
                }}
              >
                <Plus className="size-4" />
                Add item
              </button>
              
              <div className="my-1 h-px bg-border" />

              {/* Invoices Section */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Invoices
              </div>
              <Link
                href="/invoices/review"
                className="flex flex-row items-center px-2 justify-between text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex flex-row items-center gap-2 py-1.5">
                  <ClipboardListIcon className="size-4" />
                  Review invoices
                </div>
                <ExternalLink className="size-4" />
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <UploadInvoice open={UploadOpen} onOpenChange={setUploadOpen} />
      <AddItemDialog open={AddItemOpen} onOpenChange={setAddItemOpen} />
    </div>
  );
}

export default PageHeader;
