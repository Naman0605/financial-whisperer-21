
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface GoalItemProps {
  id: string;
  name: string;
  amount: string;
  onNameChange: (id: string, name: string) => void;
  onAmountChange: (id: string, amount: string) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
}

const GoalItem = ({
  id,
  name,
  amount,
  onNameChange,
  onAmountChange,
  onRemove,
  showRemove = true
}: GoalItemProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 w-full">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Goal name"
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-1/3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">₹</div>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => onAmountChange(id, e.target.value)}
            className="pl-7 w-full"
          />
        </div>
      </div>
      {showRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(id)}
          className="text-gray-500 hover:text-red-500 mt-2 md:mt-0"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default GoalItem;
