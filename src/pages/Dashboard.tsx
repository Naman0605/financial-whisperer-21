
import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();

  // Redirect to sign in page if not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

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
