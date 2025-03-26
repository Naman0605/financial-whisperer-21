
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { useOnboardingSteps } from "@/components/onboarding/OnboardingStepsHandler";
import { ExpensesStep, BankLinkStep, SavingsGoalsStep, AIAssistantStep, SuccessStep } from "@/components/onboarding/Steps";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    currentStep, 
    totalSteps, 
    handleNext, 
    handlePrev, 
    isFirstStep, 
    isLastStep,
    expenses,
    updateExpense,
    addExpense,
    removeExpense,
    goals,
    updateGoal,
    addGoal,
    removeGoal
  } = useOnboardingSteps();

  // Ensure the user is authenticated
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  const StepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ExpensesStep 
            expenses={expenses}
            onUpdateExpense={updateExpense}
            onAddExpense={addExpense}
            onRemoveExpense={removeExpense}
          />
        );
      case 2:
        return <BankLinkStep />;
      case 3:
        return (
          <SavingsGoalsStep 
            goals={goals}
            onUpdateGoal={updateGoal}
            onAddGoal={addGoal}
            onRemoveGoal={removeGoal}
          />
        );
      case 4:
        return <AIAssistantStep />;
      case 5:
        return <SuccessStep />;
      default:
        return <ExpensesStep 
          expenses={expenses}
          onUpdateExpense={updateExpense}
          onAddExpense={addExpense}
          onRemoveExpense={removeExpense}
        />;
    }
  };

  if (!user) {
    return null; // Don't render anything until we redirect to signin
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrev={handlePrev}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
    >
      <StepComponent />
    </OnboardingLayout>
  );
};

export default Onboarding;
