
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export const useOnboardingSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [expenses, setExpenses] = useState([
    { id: uuidv4(), name: "Rent/Mortgage", amount: "" },
    { id: uuidv4(), name: "Utilities", amount: "" },
    { id: uuidv4(), name: "Groceries", amount: "" },
    { id: uuidv4(), name: "Transportation", amount: "" }
  ]);
  
  const [goals, setGoals] = useState([
    { id: uuidv4(), name: "Emergency Fund", target: "", monthly: "" },
    { id: uuidv4(), name: "Vacation", target: "", monthly: "" }
  ]);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const totalSteps = 5;
  
  const handleNext = async () => {
    // When completing the expenses step (step 1), save expenses to Supabase
    if (currentStep === 1) {
      await saveExpenses();
    }
    
    // When completing the savings goals step (step 3), save goals to Supabase
    if (currentStep === 3) {
      await saveGoals();
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Functions to update the onboarding data
  const updateExpense = (id, field, value) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  
  const addExpense = () => {
    const newExpense = { id: uuidv4(), name: "", amount: "" };
    setExpenses([...expenses, newExpense]);
    return newExpense;
  };
  
  const removeExpense = (id) => {
    if (expenses.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one expense category.",
        variant: "destructive"
      });
      return;
    }
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const updateGoal = (id, field, value) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };
  
  const addGoal = () => {
    const newGoal = { id: uuidv4(), name: "", target: "", monthly: "" };
    setGoals([...goals, newGoal]);
    return newGoal;
  };
  
  const removeGoal = (id) => {
    if (goals.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one savings goal.",
        variant: "destructive"
      });
      return;
    }
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  // Save expenses to Supabase
  const saveExpenses = async () => {
    if (!user) return;
    
    try {
      // First, prepare the data
      const expensesToSave = expenses
        .filter(exp => exp.name.trim() !== "") // Skip empty expenses
        .map(exp => ({
          id: exp.id,
          user_id: user.id,
          name: exp.name,
          amount: parseFloat(exp.amount) || 0,
          category: 'Onboarding' // Default category for onboarding expenses
        }));
      
      if (expensesToSave.length === 0) return;
      
      // Insert expenses into the database
      const { error } = await supabase
        .from('expenses')
        .upsert(expensesToSave, { onConflict: 'id' });
      
      if (error) throw error;
      
      toast({
        title: "Expenses saved",
        description: "Your expenses have been saved successfully."
      });
      
    } catch (error) {
      console.error('Error saving expenses:', error);
      toast({
        title: "Error saving expenses",
        description: "There was a problem saving your expenses.",
        variant: "destructive"
      });
    }
  };
  
  // Save goals to Supabase
  const saveGoals = async () => {
    if (!user) return;
    
    try {
      // First, prepare the data
      const goalsToSave = goals
        .filter(goal => goal.name.trim() !== "") // Skip empty goals
        .map(goal => ({
          id: goal.id,
          user_id: user.id,
          name: goal.name,
          target_amount: parseFloat(goal.target) || 0,
          current_amount: 0, // Start with 0 progress
          monthly_contribution: parseFloat(goal.monthly) || 0
        }));
      
      if (goalsToSave.length === 0) return;
      
      // Insert goals into the database
      const { error } = await supabase
        .from('goals')
        .upsert(goalsToSave, { onConflict: 'id' });
      
      if (error) throw error;
      
      toast({
        title: "Goals saved",
        description: "Your savings goals have been saved successfully."
      });
      
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: "Error saving goals",
        description: "There was a problem saving your savings goals.",
        variant: "destructive"
      });
    }
  };
  
  return {
    currentStep,
    totalSteps,
    handleNext,
    handlePrev,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    expenses,
    updateExpense,
    addExpense,
    removeExpense,
    goals,
    updateGoal,
    addGoal,
    removeGoal
  };
};

export default useOnboardingSteps;
