"use client";

import { useWorkspace } from "@/components/workspace";
import { InventorySkeleton } from "@/components/structure";
import { InventoryTable } from "@/components/tables/inventory-table";
import { AuthGuard, PageContainer, PageHeader } from "@/components/structure";

const Page = () => {
  const { workspace } = useWorkspace();

  return (
    <AuthGuard
      skeleton={
        <PageContainer>
          <InventorySkeleton />
        </PageContainer>
      }
      restrictedContentName="Inventory"
    >
      <div className="flex flex-col flex-1 gap-6 min-h-0">
        <PageHeader content="inventory" />

        <div className="flex-1 flex flex-col min-h-0">
          <InventoryTable key={workspace} />
        </div>
      </div>
    </AuthGuard>
  );
};

export default Page;
