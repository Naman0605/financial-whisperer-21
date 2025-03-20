import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface ExpenseItem {
  id: string;
  name: string;
  amount: string;
}

interface GoalItem {
  id: string;
  name: string;
  amount: string;
}

export function useExpenseManager() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', name: 'Rent', amount: '' }
  ]);
  
  const [goals, setGoals] = useState<GoalItem[]>([
    { id: '1', name: 'Emergency Fund', amount: '' }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchExpensesAndGoals();
    }
  }, [user]);

  const fetchExpensesAndGoals = async () => {
    setIsLoading(true);
    
    try {
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('id, name, amount')
        .eq('user_id', user?.id);
      
      if (expensesError) {
        throw expensesError;
      }
      
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('id, name, target_amount')
        .eq('user_id', user?.id);
      
      if (goalsError) {
        throw goalsError;
      }
      
      const transformedGoals = goalsData.map(goal => ({
        id: goal.id,
        name: goal.name,
        amount: goal.target_amount.toString()
      }));
      
      const transformedExpenses = expensesData.map(expense => ({
        id: expense.id,
        name: expense.name,
        amount: expense.amount.toString()
      }));
      
      if (transformedExpenses.length > 0) {
        setExpenses(transformedExpenses);
      }
      
      if (transformedGoals.length > 0) {
        setGoals(transformedGoals);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error fetching data",
        description: "There was a problem loading your expenses and goals.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async () => {
    if (!user) return;
    
    const newId = uuidv4();
    const newExpense = { id: newId, name: 'New Expense', amount: '' };
    
    setExpenses([...expenses, newExpense]);
    
    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          id: newId,
          user_id: user.id,
          name: newExpense.name,
          amount: parseFloat(newExpense.amount) || 0
        });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error adding expense",
        description: "There was a problem saving your expense.",
        variant: "destructive"
      });
      
      setExpenses(expenses.filter(e => e.id !== newId));
    }
  };

  const updateExpenseName = async (id: string, name: string) => {
    if (!user) return;
    
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, name } : expense
    ));
    
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error updating expense name:', error);
      toast({
        title: "Error updating expense",
        description: "There was a problem saving your changes.",
        variant: "destructive"
      });
    }
  };

  const updateExpenseAmount = async (id: string, amount: string) => {
    if (!user) return;
    
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, amount } : expense
    ));
    
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ amount: parseFloat(amount) || 0 })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error updating expense amount:', error);
      toast({
        title: "Error updating expense",
        description: "There was a problem saving your changes.",
        variant: "destructive"
      });
    }
  };

  const removeExpense = async (id: string) => {
    if (!user) return;
    
    setExpenses(expenses.filter(expense => expense.id !== id));
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error removing expense:', error);
      toast({
        title: "Error removing expense",
        description: "There was a problem deleting your expense.",
        variant: "destructive"
      });
      
      fetchExpensesAndGoals();
    }
  };

  const addGoal = async () => {
    if (!user) return;
    
    const newId = uuidv4();
    const newGoal = { id: newId, name: 'New Savings Goal', amount: '' };
    
    setGoals([...goals, newGoal]);
    
    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          id: newId,
          user_id: user.id,
          name: newGoal.name,
          target_amount: parseFloat(newGoal.amount) || 0
        });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error adding goal",
        description: "There was a problem saving your savings goal.",
        variant: "destructive"
      });
      
      setGoals(goals.filter(g => g.id !== newId));
    }
  };

  const updateGoalName = async (id: string, name: string) => {
    if (!user) return;
    
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, name } : goal
    ));
    
    try {
      const { error } = await supabase
        .from('goals')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error updating goal name:', error);
      toast({
        title: "Error updating goal",
        description: "There was a problem saving your changes.",
        variant: "destructive"
      });
    }
  };

  const updateGoalAmount = async (id: string, amount: string) => {
    if (!user) return;
    
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, amount } : goal
    ));
    
    try {
      const { error } = await supabase
        .from('goals')
        .update({ target_amount: parseFloat(amount) || 0 })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error updating goal amount:', error);
      toast({
        title: "Error updating goal",
        description: "There was a problem saving your changes.",
        variant: "destructive"
      });
    }
  };

  const removeGoal = async (id: string) => {
    if (!user) return;
    
    setGoals(goals.filter(goal => goal.id !== id));
    
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error removing goal:', error);
      toast({
        title: "Error removing goal",
        description: "There was a problem deleting your savings goal.",
        variant: "destructive"
      });
      
      fetchExpensesAndGoals();
    }
  };

  return {
    expenses,
    goals,
    isLoading,
    addExpense,
    updateExpenseName,
    updateExpenseAmount,
    removeExpense,
    addGoal,
    updateGoalName,
    updateGoalAmount,
    removeGoal
  };
}
