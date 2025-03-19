
import Navbar from "@/components/layout/Navbar";
import ExpenseEntry from "@/components/expenses/ExpenseEntry";

const ExpensesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-20">
        <ExpenseEntry />
      </div>
    </div>
  );
};

export default ExpensesPage;
