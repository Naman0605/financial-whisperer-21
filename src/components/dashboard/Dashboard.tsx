
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MonthlySnapshot from "./MonthlySnapshot";
import SpendingBreakdown from "./SpendingBreakdown";
import AIRecommendations from "./AIRecommendations";
import AIChatWidget from "./AIChatWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EmptyDataState from "@/components/expenses/EmptyDataState";
import { 
  PlusCircle, 
  Filter, 
  ChevronDown,
  SlidersHorizontal,
  CreditCard,
  Wallet,
  LineChart,
  BarChart
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterMonth, setFilterMonth] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [hasExpenses, setHasExpenses] = useState(false);
  const [hasGoals, setHasGoals] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Check if user has any expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (expensesError) throw expensesError;
      setHasExpenses(expenses && expenses.length > 0);

      // Check if user has any goals
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (goalsError) throw goalsError;
      setHasGoals(goals && goals.length > 0);

      // Fetch recent transactions for the transaction list
      if (expenses && expenses.length > 0) {
        const { data: transactions, error: transactionsError } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(5);
        
        if (transactionsError) throw transactionsError;
        setRecentTransactions(transactions || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const months = [
    { value: "all", label: "All Time" },
    { value: "jan", label: "January" },
    { value: "feb", label: "February" },
    { value: "mar", label: "March" },
    { value: "apr", label: "April" },
    { value: "may", label: "May" },
    { value: "jun", label: "June" },
    { value: "jul", label: "July" },
    { value: "aug", label: "August" },
    { value: "sep", label: "September" },
    { value: "oct", label: "October" },
    { value: "nov", label: "November" },
    { value: "dec", label: "December" },
  ];
  
  const sortOptions = [
    { value: "date", label: "Date (Newest)" },
    { value: "date-asc", label: "Date (Oldest)" },
    { value: "amount-desc", label: "Amount (Highest)" },
    { value: "amount-asc", label: "Amount (Lowest)" },
  ];

  const applyFilters = () => {
    toast({
      title: "Filters Applied",
      description: `Showing ${filterMonth !== "all" ? months.find(m => m.value === filterMonth)?.label : "All Time"} transactions sorted by ${sortOptions.find(o => o.value === sortBy)?.label}`,
    });
  };
  
  const handleAddTransaction = async () => {
    if (!transactionAmount || !transactionType || !user) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount and select a transaction type",
        variant: "destructive",
      });
      return;
    }

    try {
      if (transactionType === "Expense") {
        const { error } = await supabase
          .from('expenses')
          .insert({
            user_id: user.id,
            name: "New Expense",
            amount: parseFloat(transactionAmount),
            category: "General"
          });
          
        if (error) throw error;
      }
      
      toast({
        title: `${transactionType} Added`,
        description: `Added ₹${transactionAmount} to your ${transactionType.toLowerCase()} records`,
      });
      setTransactionAmount("");
      setTransactionType("");
      setIsAddDialogOpen(false);
      
      // Refresh data after adding a transaction
      fetchUserData();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewAll = () => {
    navigate("/expenses");
  };

  const handleViewDetails = () => {
    navigate("/dashboard");
    toast({
      title: "AI Recommendations",
      description: "Showing detailed recommendations for your finances",
    });
  };

  const handleAddData = () => {
    navigate("/expenses");
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finance-teal"></div>
        </div>
      </div>
    );
  }

  // If there's no data, show the empty state
  if (!hasExpenses && !hasGoals) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome! Let's get started with tracking your finances.
          </p>
        </div>
        
        <EmptyDataState 
          title="No financial data yet"
          description="Start by adding your expenses and savings goals to get personalized insights and recommendations."
          actionLabel="Add Your Financial Data"
          onAction={handleAddData}
          icon={<LineChart className="h-8 w-8 text-muted-foreground" />}
        />
        
        <div className="glass-card mt-8">
          <AIChatWidget />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your financial situation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {hasExpenses ? (
          <MonthlySnapshot />
        ) : (
          <div className="glass-card h-full flex items-center justify-center">
            <EmptyDataState 
              title="No expense data"
              description="Add your expenses to see a monthly snapshot."
              actionLabel="Add Expenses"
              onAction={handleAddData}
              icon={<BarChart className="h-8 w-8 text-muted-foreground" />}
            />
          </div>
        )}
        
        <div className="lg:col-span-2">
          {hasExpenses ? (
            <SpendingBreakdown />
          ) : (
            <div className="glass-card h-full flex items-center justify-center">
              <EmptyDataState 
                title="No spending data"
                description="Add your spending data to see your breakdown by category."
                actionLabel="Add Expenses"
                onAction={handleAddData}
                icon={<PieChart className="h-8 w-8 text-muted-foreground" />}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="md:col-span-3">
          <div className="glass-card h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800" style={{ zIndex: 100 }}>
                      <div className="p-2">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Month</p>
                          <Select value={filterMonth} onValueChange={setFilterMonth}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {months.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2 mt-3">
                          <p className="text-xs font-medium text-muted-foreground">Sort By</p>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full mt-3 bg-finance-teal hover:bg-finance-teal/90 text-white"
                          onClick={applyFilters}
                        >
                          <SlidersHorizontal className="h-3 w-3 mr-2" />
                          Apply Filters
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="h-8 bg-finance-teal hover:bg-finance-teal/90 text-white">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800">
                      <DialogHeader>
                        <DialogTitle>Add Transaction</DialogTitle>
                        <DialogDescription>
                          Add a new income or expense to your records.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            variant="outline"
                            className={`h-20 flex flex-col items-center justify-center hover:border-finance-success ${transactionType === "Income" ? "text-finance-success border-finance-success bg-finance-success/10" : "text-muted-foreground"}`}
                            onClick={() => setTransactionType("Income")}
                          >
                            <Wallet className="h-8 w-8 mb-2" />
                            Income
                          </Button>
                          <Button 
                            variant="outline"
                            className={`h-20 flex flex-col items-center justify-center hover:border-finance-danger ${transactionType === "Expense" ? "text-finance-danger border-finance-danger bg-finance-danger/10" : "text-muted-foreground"}`}
                            onClick={() => setTransactionType("Expense")}
                          >
                            <CreditCard className="h-8 w-8 mb-2" />
                            Expense
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="amount" className="text-sm font-medium">
                            Amount
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</div>
                            <Input 
                              id="amount" 
                              type="number" 
                              placeholder="0.00" 
                              className="pl-7" 
                              value={transactionAmount}
                              onChange={(e) => setTransactionAmount(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            className="bg-finance-teal hover:bg-finance-teal/90 text-white"
                            onClick={handleAddTransaction}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Transaction
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {hasExpenses && recentTransactions.length > 0 ? (
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="m-0">
                    <div className="space-y-2">
                      {recentTransactions.map((transaction, index) => {
                        const icon = getCategoryIcon(transaction.category);
                        const formattedAmount = transaction.amount > 0 
                          ? `+₹${transaction.amount.toFixed(2)}` 
                          : `-₹${Math.abs(transaction.amount).toFixed(2)}`;
                        const date = new Date(transaction.date).toLocaleDateString();
                        
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                                {icon}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.name}</p>
                                <p className="text-xs text-muted-foreground">{date} • {transaction.category || 'General'}</p>
                              </div>
                            </div>
                            <span className={transaction.amount > 0 ? "text-finance-success font-medium" : "text-finance-danger font-medium"}>
                              {formattedAmount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm" className="w-full" onClick={handleViewAll}>
                        View All Transactions
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="income" className="m-0">
                    <div className="space-y-2">
                      {recentTransactions.filter(t => t.amount > 0).map((transaction, index) => {
                        const icon = getCategoryIcon(transaction.category);
                        const formattedAmount = `+₹${transaction.amount.toFixed(2)}`;
                        const date = new Date(transaction.date).toLocaleDateString();
                        
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                                {icon}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.name}</p>
                                <p className="text-xs text-muted-foreground">{date} • {transaction.category || 'Income'}</p>
                              </div>
                            </div>
                            <span className="text-finance-success font-medium">
                              {formattedAmount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {recentTransactions.filter(t => t.amount > 0).length > 0 ? (
                      <div className="mt-4 text-center">
                        <Button variant="outline" size="sm" className="w-full" onClick={handleViewAll}>
                          View All Income
                        </Button>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No income transactions found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="expenses" className="m-0">
                    <div className="space-y-2">
                      {recentTransactions.filter(t => t.amount < 0).map((transaction, index) => {
                        const icon = getCategoryIcon(transaction.category);
                        const formattedAmount = `-₹${Math.abs(transaction.amount).toFixed(2)}`;
                        const date = new Date(transaction.date).toLocaleDateString();
                        
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                                {icon}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.name}</p>
                                <p className="text-xs text-muted-foreground">{date} • {transaction.category || 'Expense'}</p>
                              </div>
                            </div>
                            <span className="text-finance-danger font-medium">
                              {formattedAmount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {recentTransactions.filter(t => t.amount < 0).length > 0 ? (
                      <div className="mt-4 text-center">
                        <Button variant="outline" size="sm" className="w-full" onClick={handleViewAll}>
                          View All Expenses
                        </Button>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No expense transactions found</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <EmptyDataState 
                  title="No transactions yet"
                  description="Add your first transaction to start tracking your finances."
                  actionLabel="Add Transaction"
                  onAction={() => setIsAddDialogOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <AIRecommendations onViewDetails={handleViewDetails} />
        </div>
      </div>
      
      <div className="glass-card">
        <AIChatWidget />
      </div>
    </div>
  );
};

// Helper function to get category icon
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'food':
    case 'grocery':
    case 'groceries':
      return '🛒';
    case 'utilities':
      return '⚡';
    case 'dining':
    case 'restaurant':
      return '☕';
    case 'shopping':
      return '🛍️';
    case 'transportation':
      return '⛽';
    case 'income':
    case 'salary':
      return '💼';
    case 'investment':
      return '📈';
    default:
      return '💳';
  }
};

export default Dashboard;
