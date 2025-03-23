
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyDataStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

export const EmptyDataState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}: EmptyDataStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <PlusCircle className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button onClick={onAction} className="bg-finance-teal hover:bg-finance-teal/90 text-white">
        <PlusCircle className="mr-2 h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyDataState;
