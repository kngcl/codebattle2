import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  action?: () => void;
}

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  startOnboarding: (steps: OnboardingStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  finishOnboarding: () => void;
  isFirstTime: boolean;
  setIsFirstTime: (value: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [isFirstTime, setIsFirstTimeState] = useState(() => {
    const stored = localStorage.getItem('codebattle-first-time');
    return stored !== 'false';
  });

  const setIsFirstTime = (value: boolean) => {
    setIsFirstTimeState(value);
    localStorage.setItem('codebattle-first-time', value.toString());
  };

  const startOnboarding = (onboardingSteps: OnboardingStep[]) => {
    setSteps(onboardingSteps);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
    setIsFirstTime(false);
  };

  const finishOnboarding = () => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
    setIsFirstTime(false);
  };

  // Execute step action when step changes
  useEffect(() => {
    if (isActive && steps[currentStep]?.action) {
      steps[currentStep].action();
    }
  }, [currentStep, isActive, steps]);

  const value: OnboardingContextType = {
    isActive,
    currentStep,
    totalSteps: steps.length,
    steps,
    startOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    finishOnboarding,
    isFirstTime,
    setIsFirstTime
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};