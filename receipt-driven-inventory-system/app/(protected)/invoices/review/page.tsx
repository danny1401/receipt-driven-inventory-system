"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Input, Separator } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Page = () => {
  const user = useQuery(api.auth.getCurrentUser);

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <div>Unauthorized</div>;
  }

  const invoices = [
    {
      orderId: "2026/181224",
      supplierName: "BAMA Storkjøkken Oslo",
      customerName: "Osteria De Campo",
      orderDate: "08.10.2026",
      orderItems: [
        {
          itemNumber: 4,
          itemName: "Norwegian Salmon Filet",
          quantity: 1,
          quantityUnit: "kg",
          unitPrice: "48.00",
          totalAmount: "48.00",
        },
        {
          itemNumber: 10,
          itemName: "Norwegian Salmon Filet",
          quantity: 1,
          quantityUnit: "kg",
          unitPrice: "48.00",
          totalAmount: "48.00",
        },
      ],
      fileName: "file.pdf",
    },
    {
      orderId: "2026/181223",
      supplierName: "BAMA Storkjøkken Oslo",
      customerName: "Osteria De Campo",
      orderDate: "08.10.2026",
      orderItems: [
        {
          itemNumber: 0,
          itemName: "Norwegian Salmon Filet",
          quantity: 1,
          quantityUnit: "kg",
          unitPrice: "48.00",
          totalAmount: "48.00",
        },
      ],
      fileName: "file.pdf",
    },
    {
      orderId: "2026/181222",
      supplierName: "BAMA Storkjøkken Oslo",
      customerName: "Osteria De Campo",
      orderDate: "08.10.2026",
      orderItems: [
        {
          itemNumber: 1,
          itemName: "Norwegian Salmon Filet",
          quantity: 1,
          quantityUnit: "kg",
          unitPrice: "48.00",
          totalAmount: "48.00",
        },
      ],
      fileName: "file.pdf",
    },
    {
      orderId: "2026/181221",
      supplierName: "BAMA Storkjøkken Oslo",
      customerName: "Osteria De Campo",
      orderDate: "08.10.2026",
      orderItems: [
        {
          itemNumber: 2,
          itemName: "Norwegian Salmon Filet",
          quantity: 1,
          quantityUnit: "kg",
          unitPrice: "48.00",
          totalAmount: "48.00",
        },
      ],
      fileName: "file.pdf",
    },
  ];

  return (
    <div>
      <div className="flex flex-row">
        <h1 className="mb-4 text-2xl font-bold">Review invoices</h1>
      </div>
      <Separator />

      <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        
        <div className="flex flex-row">
          Search:
          <Input placeholder="search engine input"></Input>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline">Filter</Button>}
            />
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Date</DropdownMenuItem>
              <DropdownMenuItem>Supplier</DropdownMenuItem>
              <DropdownMenuItem>Restaurant</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline">Sort</Button>}
            />
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuItem>Name (A to Z)</DropdownMenuItem>
              <DropdownMenuItem>Name (Z to A)</DropdownMenuItem>
              <DropdownMenuItem>Date (New to Old)</DropdownMenuItem>
              <DropdownMenuItem>Date (Old to New)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">Add Invoice</Button>
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-between w-1/2">
            <div className="flex flex-row px-5 mx-auto w-full justify-between">
              <div className="w-[100px]">Invoice</div>
              <div>Supplier</div>
              <div>Restaurant</div>
              <div>Order Date</div>
              <div className="text-right">Actions</div>
            </div>
          <div>
            {invoices.map((invoice) => (
              <div key={invoice.orderId}>
                <Collapsible className="rounded-md data-open:bg-muted">
                  <CollapsibleTrigger
                    render={
                      <Button variant="ghost" className="w-full">
                        <div className="font-medium">{invoice.orderId}</div>
                        <div>{invoice.supplierName}</div>
                        <div>{invoice.customerName}</div>
                        <div>{invoice.orderDate}</div>
                        
                        <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
                      </Button>
                    }
                  />
                  {invoice.orderItems.map((item) => (
                    <CollapsibleContent
                      className="flex flex-row items-start gap-2 p-2.5 pt-0 text-sm"
                      key={item.itemNumber}
                    >
                      <div>{item.itemNumber}</div>
                      <div>{item.itemName}</div>
                      <div>{item.quantity}</div>
                      <div>{item.quantityUnit}</div>
                      <div>{item.unitPrice}</div>
                      <div>{item.totalAmount}</div>
                      <div className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                >
                                  <MoreHorizontalIcon />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                    </CollapsibleContent>
                  ))}
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-between w-1/2 bg-neutral-50">
          hey
        </div>
      </div>
    </div>
  );
};

export default Page;
