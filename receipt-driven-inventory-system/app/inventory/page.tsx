"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useWorkspace } from "@/components/workspace";
import {
  InventorySkeleton,
  RestrictedPage,
} from "@/components/custom";
import { InventoryTable } from "@/components/tables/inventory-table";
import { PageContainer, PageHeader } from "@/components/structure";

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

        <PageHeader content="inventory" />

        <div className="flex-1 flex flex-col min-h-0">
          <InventoryTable key={workspace} />
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
