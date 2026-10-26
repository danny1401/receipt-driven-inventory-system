import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { InventoryRow } from "./inventory-table";

type InventoryRowActionsProps = {
  item: InventoryRow;
  onEdit?: (item: InventoryRow) => void;
  onMoveStock?: (item: InventoryRow) => void;
  onDeleteRequest: (item: InventoryRow) => void;
};

export function InventoryRowActions({
  item,
  onEdit,
  onMoveStock,
  onDeleteRequest,
}: InventoryRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={() => onEdit?.(item)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMoveStock?.(item)}>
          Move stock
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDeleteRequest(item)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}