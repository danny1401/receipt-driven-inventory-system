import {
  ShieldAlertIcon,
  UploadIcon,
  MailIcon,
  PackageIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import type { ComponentType } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

import type { InvoiceStatus, InvoiceListItem } from "@/data/invoices";

type StatusMeta = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  variant: "destructive" | "secondary" | "outline";
  className?: string;
};

const STATUS_META: Record<InvoiceStatus, StatusMeta> = {
  flagged: {
    label: "Flagged for review",
    icon: ShieldAlertIcon,
    variant: "outline",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  manual: {
    label: "Manually uploaded",
    icon: UploadIcon,
    variant: "secondary",
  },
  email: {
    label: "Received from email",
    icon: MailIcon,
    variant: "outline",
  },
};

export function InvoiceRow({
  invoice,
  onEditRequest,
  onDeleteRequest,
}: {
  invoice: InvoiceListItem;
  onEditRequest: () => void;
  onDeleteRequest: () => void;
}) {
  const status = STATUS_META[invoice.status];
  const StatusIcon = status.icon;
  const itemCount = invoice.orderItems.length;

  return (
    <div className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:grid sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_7rem_6rem_2rem] sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-col gap-1.5 sm:block">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium tabular-nums">
            {invoice.orderId}
          </span>
          <Badge variant={status.variant} className={status.className}>
            <StatusIcon />
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:contents">
        <span className="min-w-0 truncate text-xs sm:block sm:text-sm">
          {invoice.supplierName}
        </span>
        <span aria-hidden="true" className="sm:hidden">
          ·
        </span>
        <span className="text-xs tabular-nums sm:text-sm">
          {invoice.orderDate}
        </span>
        <span aria-hidden="true" className="sm:hidden">
          ·
        </span>
        <span className="inline-flex items-center gap-1 text-xs sm:text-sm">
          <PackageIcon className="size-3.5" />
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="self-end sm:self-auto sm:justify-self-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreHorizontalIcon />
                <span className="sr-only">Open invoice actions</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEditRequest}>
              <PencilIcon />
              Edit invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDeleteRequest}>
              <Trash2Icon />
              Delete invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
