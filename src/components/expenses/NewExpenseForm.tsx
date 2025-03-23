
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Plus, Save, Tag, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const categories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Personal",
  "Debt",
  "Education",
  "Travel",
  "Other"
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface NewExpenseFormProps {
  onSuccess?: () => void;
}

export const NewExpenseForm = ({ onSuccess }: NewExpenseFormProps) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !name || !amount || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newExpense = {
        id: uuidv4(),
        user_id: user.id,
        name,
        amount: parseFloat(amount),
        category,
        date: format(date, "yyyy-MM-dd"),
        notes
      };
      
      const { error } = await supabase
        .from('expenses')
        .insert(newExpense);
      
      if (error) throw error;
      
      toast({
        title: "Expense added",
        description: "Your expense has been successfully saved",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setName("");
      setAmount("");
      setCategory("");
      setDate(new Date());
      setNotes("");
      
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error adding expense",
        description: "There was a problem saving your expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden glass-card">
      <CardHeader className="bg-gradient-to-r from-finance-teal/10 to-finance-teal/5 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Plus className="h-5 w-5 text-finance-teal" />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div className="space-y-2" variants={item}>
            <Label htmlFor="name" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="name"
              placeholder="Enter expense description"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              required
            />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div className="space-y-2" variants={item}>
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                </div>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div className="space-y-2" variants={item}>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="w-full">
                  <div className="flex items-center gap-2">
                    {category ? (
                      <>
                        <Tag className="h-4 w-4" />
                        <SelectValue placeholder="Select a category" />
                      </>
                    ) : (
                      <SelectValue placeholder="Select a category" />
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>
          
          <motion.div className="space-y-2" variants={item}>
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </motion.div>
          
          <motion.div className="space-y-2" variants={item}>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </motion.div>
          
          <motion.div className="pt-2" variants={item}>
            <Button 
              type="submit"
              className="w-full bg-finance-teal hover:bg-finance-teal/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Expense
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
};

export default NewExpenseForm;
