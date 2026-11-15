"use client";

import { useWorkspace } from "@/components/workspace";
import { InventoryTable } from "@/components/tables/inventory-table";
import { PageHeader } from "@/components/structure";

const Page = () => {
  const { workspace } = useWorkspace();

  return (
    <div className="flex flex-col flex-1 gap-6 min-h-0">
      <PageHeader content="inventory" />

      <div className="flex-1 flex flex-col min-h-0">
        <InventoryTable key={workspace} />
      </div>
    </div>
  );
};

export default Page;
