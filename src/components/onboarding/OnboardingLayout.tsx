
import { useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  isLastStep,
  isFirstStep
}: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="py-4 px-4 md:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-finance-teal" />
            <span className="font-semibold">FinWhisperer</span>
          </Link>
          
          <div className="text-sm">
            <span className="text-finance-teal font-medium">Step {currentStep}</span> of {totalSteps}
          </div>
        </div>
      </header>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-800 h-1">
        <div 
          className="bg-finance-teal h-1 transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }} 
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl mx-auto glass-card p-6 md:p-8 animate-fade-in">
          {children}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onPrev}
              disabled={isFirstStep}
              className={isFirstStep ? "opacity-0" : ""}
            >
              Back
            </Button>
            
            <Button
              onClick={onNext}
              className="bg-finance-teal hover:bg-finance-teal/90 text-white"
            >
              {isLastStep ? "Complete Setup" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
