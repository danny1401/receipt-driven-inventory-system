"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  AddItemDialog,
  InventorySkeleton,
  PageContainer,
  RestrictedPage,
  useWorkspace,
  WorkspaceSwitcher,
} from "@/components/custom";
import { InventoryTable } from "@/components/tables/inventory-table";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRightIcon,
  Download,
  PlusSquare,
  Settings2Icon,
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

const Page = () => {
  const user = useQuery(api.auth.getCurrentUser);
  const { workspace } = useWorkspace();

  if (user === undefined) {
    return (
      <PageContainer>
        <InventorySkeleton />
      </PageContainer>
    );
  }

  if (user === null) {
    return <RestrictedPage content="Inventory" />;
  }

  return (
    <PageContainer>
      <div className="flex flex-col flex-1 gap-6 min-h-0">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
            <p className="text-sm text-muted-foreground">
              Every line item captured from your supplier invoices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <WorkspaceSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="default" />}>
                <Settings2Icon></Settings2Icon>
                Options
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Item</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <PlusSquare />
                    <AddItemDialog />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Inventory</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <ArrowLeftRightIcon />
                    Replace inventory
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download />
                    Export inventory
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <InventoryTable key={workspace} />
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
