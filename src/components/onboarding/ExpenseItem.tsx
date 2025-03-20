
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ExpenseItemProps {
  id: string;
  name: string;
  amount: string;
  onNameChange: (id: string, name: string) => void;
  onAmountChange: (id: string, amount: string) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
}

const ExpenseItem = ({
  id,
  name,
  amount,
  onNameChange,
  onAmountChange,
  onRemove,
  showRemove = true
}: ExpenseItemProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Expense name"
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          className="mb-2"
        />
      </div>
      <div className="w-1/3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">₹</div>
          <Input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => onAmountChange(id, e.target.value)}
            className="pl-7"
          />
        </div>
      </div>
      {showRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(id)}
          className="text-gray-500 hover:text-red-500"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ExpenseItem;
