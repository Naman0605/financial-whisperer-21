
import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-20">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
