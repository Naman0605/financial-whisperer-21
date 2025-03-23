
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewExpenseForm from "@/components/expenses/NewExpenseForm";
import ExpenseEntry from "@/components/expenses/ExpenseEntry";
import NewGoalForm from "@/components/goals/NewGoalForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ExpensesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("add-expense");
  const [hasExpenses, setHasExpenses] = useState(false);
  const [hasGoals, setHasGoals] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Check if user has any expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (expensesError) throw expensesError;
        
        // Check if user has any goals
        const { data: goals, error: goalsError } = await supabase
          .from('goals')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (goalsError) throw goalsError;
        
        setHasExpenses(expenses && expenses.length > 0);
        setHasGoals(goals && goals.length > 0);
      } catch (error) {
        console.error("Error checking user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserData();
  }, [user]);

  // Redirect to sign in page if not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-20">
        <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Money Manager</h1>
            <p className="text-muted-foreground">
              Track your finances by adding expenses and saving goals.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
              <TabsTrigger value="add-goal">Add Savings Goal</TabsTrigger>
              <TabsTrigger value="expense-entry">Full Expense Form</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add-expense" className="mt-0">
              <NewExpenseForm onSuccess={() => setHasExpenses(true)} />
            </TabsContent>
            
            <TabsContent value="add-goal" className="mt-0">
              <NewGoalForm onSuccess={() => setHasGoals(true)} />
            </TabsContent>
            
            <TabsContent value="expense-entry" className="mt-0">
              <ExpenseEntry />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
