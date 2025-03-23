
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, Calendar, Save, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

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

export const NewGoalForm = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !name || !targetAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newGoal = {
        id: uuidv4(),
        user_id: user.id,
        name,
        target_amount: parseFloat(targetAmount),
        current_amount: 0,
        monthly_contribution: monthlyContribution ? parseFloat(monthlyContribution) : null
      };
      
      const { error } = await supabase
        .from('goals')
        .insert(newGoal);
      
      if (error) throw error;
      
      toast({
        title: "Goal added",
        description: "Your savings goal has been successfully saved",
      });
      
      // Reset form
      setName("");
      setTargetAmount("");
      setMonthlyContribution("");
      
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Error adding goal",
        description: "There was a problem saving your goal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateMonths = () => {
    if (!targetAmount || !monthlyContribution || parseFloat(monthlyContribution) <= 0) return null;
    
    const target = parseFloat(targetAmount);
    const monthly = parseFloat(monthlyContribution);
    const months = Math.ceil(target / monthly);
    
    return months;
  };

  const months = calculateMonths();

  return (
    <Card className="w-full overflow-hidden glass-card">
      <CardHeader className="bg-gradient-to-r from-finance-success/10 to-finance-success/5 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Plus className="h-5 w-5 text-finance-success" />
          Create Savings Goal
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
              Goal Name
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Target className="h-4 w-4" />
              </div>
              <Input
                id="name"
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </motion.div>
          
          <motion.div className="space-y-2" variants={item}>
            <Label htmlFor="targetAmount" className="text-sm font-medium">
              Target Amount
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
              </div>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </motion.div>
          
          <motion.div className="space-y-2" variants={item}>
            <Label htmlFor="monthlyContribution" className="text-sm font-medium">
              Monthly Contribution (Optional)
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <Input
                id="monthlyContribution"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="pl-9"
              />
            </div>
          </motion.div>
          
          {months && (
            <motion.div 
              className="p-4 bg-finance-success/10 rounded-lg text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              With a monthly contribution of ${monthlyContribution}, you'll reach your goal in approximately <span className="font-medium">{months} {months === 1 ? 'month' : 'months'}</span>.
            </motion.div>
          )}
          
          <motion.div className="pt-2" variants={item}>
            <Button 
              type="submit"
              className="w-full bg-finance-success hover:bg-finance-success/90 text-white"
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
                  Save Goal
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
};

export default NewGoalForm;
