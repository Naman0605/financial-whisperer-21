
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { OnboardingSteps } from "@/components/onboarding/Steps";

const Onboarding = () => {
  const { 
    currentStep, 
    totalSteps, 
    handleNext, 
    handlePrev, 
    isFirstStep, 
    isLastStep, 
    StepComponent 
  } = OnboardingSteps();

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
