
import { useState } from 'react';

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
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', name: 'Rent', amount: '' }
  ]);
  
  const [goals, setGoals] = useState<GoalItem[]>([
    { id: '1', name: 'Emergency Fund', amount: '' }
  ]);

  const addExpense = () => {
    const newId = String(expenses.length + 1);
    setExpenses([...expenses, { id: newId, name: 'New Expense', amount: '' }]);
  };

  const updateExpenseName = (id: string, name: string) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, name } : expense
    ));
  };

  const updateExpenseAmount = (id: string, amount: string) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, amount } : expense
    ));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addGoal = () => {
    const newId = String(goals.length + 1);
    setGoals([...goals, { id: newId, name: 'New Savings Goal', amount: '' }]);
  };

  const updateGoalName = (id: string, name: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, name } : goal
    ));
  };

  const updateGoalAmount = (id: string, amount: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, amount } : goal
    ));
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return {
    expenses,
    goals,
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
