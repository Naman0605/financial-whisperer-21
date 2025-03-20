
import { useState } from "react";
import MonthlySnapshot from "./MonthlySnapshot";
import SpendingBreakdown from "./SpendingBreakdown";
import AIRecommendations from "./AIRecommendations";
import AIChatWidget from "./AIChatWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Filter, 
  ChevronDown,
  SlidersHorizontal,
  CreditCard,
  Wallet
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

export const Dashboard = () => {
  const [filterMonth, setFilterMonth] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
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
  
  const handleAddTransaction = (type, amount) => {
    toast({
      title: `${type} Added`,
      description: `Added $${amount} to your ${type.toLowerCase()} records`,
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your financial situation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MonthlySnapshot />
        <div className="lg:col-span-2">
          <SpendingBreakdown />
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
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Month</p>
                          <Select value={filterMonth} onValueChange={setFilterMonth}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
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
                            <SelectContent>
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
                    <DialogContent>
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
                            className="h-20 flex flex-col items-center justify-center text-finance-success hover:text-finance-success hover:border-finance-success"
                            onClick={() => handleAddTransaction("Income", "100.00")}
                          >
                            <Wallet className="h-8 w-8 mb-2" />
                            Income
                          </Button>
                          <Button 
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center text-finance-danger hover:text-finance-danger hover:border-finance-danger"
                            onClick={() => handleAddTransaction("Expense", "50.00")}
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
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</div>
                            <Input id="amount" type="number" placeholder="0.00" className="pl-7" />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button className="bg-finance-teal hover:bg-finance-teal/90 text-white">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Transaction
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="m-0">
                  <div className="space-y-2">
                    {[
                      { name: "Salary Deposit", amount: "+$3,500.00", date: "Today", category: "Income", icon: "💼" },
                      { name: "Grocery Store", amount: "-$86.42", date: "Yesterday", category: "Food", icon: "🛒" },
                      { name: "Electric Bill", amount: "-$94.20", date: "Jan 15", category: "Utilities", icon: "⚡" },
                      { name: "Coffee Shop", amount: "-$4.75", date: "Jan 14", category: "Dining", icon: "☕" },
                      { name: "Online Store", amount: "-$59.99", date: "Jan 12", category: "Shopping", icon: "🛍️" }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                            {transaction.icon}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.name}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
                          </div>
                        </div>
                        <span className={transaction.amount.startsWith("+") ? "text-finance-success font-medium" : "text-finance-danger font-medium"}>
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="income" className="m-0">
                  <div className="space-y-2">
                    {[
                      { name: "Salary Deposit", amount: "+$3,500.00", date: "Today", category: "Income", icon: "💼" },
                      { name: "Freelance Payment", amount: "+$850.00", date: "Jan 10", category: "Income", icon: "💻" },
                      { name: "Dividend", amount: "+$32.50", date: "Jan 5", category: "Investment", icon: "📈" }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                            {transaction.icon}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.name}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
                          </div>
                        </div>
                        <span className="text-finance-success font-medium">
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="expenses" className="m-0">
                  <div className="space-y-2">
                    {[
                      { name: "Grocery Store", amount: "-$86.42", date: "Yesterday", category: "Food", icon: "🛒" },
                      { name: "Electric Bill", amount: "-$94.20", date: "Jan 15", category: "Utilities", icon: "⚡" },
                      { name: "Coffee Shop", amount: "-$4.75", date: "Jan 14", category: "Dining", icon: "☕" },
                      { name: "Online Store", amount: "-$59.99", date: "Jan 12", category: "Shopping", icon: "🛍️" },
                      { name: "Gas Station", amount: "-$45.33", date: "Jan 10", category: "Transportation", icon: "⛽" }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                            {transaction.icon}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.name}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
                          </div>
                        </div>
                        <span className="text-finance-danger font-medium">
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <AIRecommendations />
        </div>
      </div>
      
      <div className="glass-card">
        <AIChatWidget />
      </div>
    </div>
  );
};

export default Dashboard;
