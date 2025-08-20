import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Rocket, Check } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';

const OnboardingOverlay: React.FC = () => {
  const { 
    isActive, 
    currentStep, 
    totalSteps, 
    steps, 
    nextStep, 
    prevStep, 
    skipOnboarding,
    finishOnboarding 
  } = useOnboarding();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (!isActive || !currentStepData?.target) {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(currentStepData.target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      // Calculate tooltip position
      const rect = element.getBoundingClientRect();
      const placement = currentStepData.placement || 'bottom';
      
      let top = 0;
      let left = 0;
      
      switch (placement) {
        case 'top':
          top = rect.top - 10;
          left = rect.left + rect.width / 2;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 10;
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 10;
          break;
      }
      
      setTooltipPosition({ top, left });
      
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  }, [isActive, currentStep, currentStepData]);

  if (!isActive || !currentStepData) return null;

  const getHighlightStyle = () => {
    if (!targetElement) return {};
    
    const rect = targetElement.getBoundingClientRect();
    return {
      position: 'fixed' as const,
      top: rect.top - 4,
      left: rect.left - 4,
      width: rect.width + 8,
      height: rect.height + 8,
      border: '2px solid #8b5cf6',
      borderRadius: '8px',
      pointerEvents: 'none' as const,
      zIndex: 9999,
      background: 'rgba(139, 92, 246, 0.1)',
      boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.2)',
      animation: 'pulse 2s infinite'
    };
  };

  const getTooltipStyle = () => {
    const placement = currentStepData.placement || 'bottom';
    let transform = '';
    
    switch (placement) {
      case 'top':
        transform = 'translate(-50%, -100%)';
        break;
      case 'right':
        transform = 'translate(0%, -50%)';
        break;
      case 'bottom':
        transform = 'translate(-50%, 0%)';
        break;
      case 'left':
        transform = 'translate(-100%, -50%)';
        break;
    }
    
    return {
      position: 'fixed' as const,
      top: tooltipPosition.top,
      left: tooltipPosition.left,
      transform,
      zIndex: 10000
    };
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" onClick={skipOnboarding} />
      
      {/* Highlight */}
      {targetElement && (
        <div style={getHighlightStyle()} />
      )}
      
      {/* Tooltip */}
      <div style={getTooltipStyle()}>
        <div className={`max-w-sm p-6 rounded-2xl shadow-2xl border ${
          isDark 
            ? 'bg-gray-900 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {currentStep === 0 ? (
                <Rocket className="w-5 h-5 text-purple-500" />
              ) : isLastStep ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Sparkles className="w-5 h-5 text-purple-500" />
              )}
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
            </div>
            <button
              onClick={skipOnboarding}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              title="Skip tutorial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Content */}
          <p className={`mb-6 leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {currentStepData.content}
          </p>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div 
                className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={skipOnboarding}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Skip
            </button>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                    isDark
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              )}
              
              <button
                onClick={isLastStep ? finishOnboarding : nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all flex items-center gap-1 shadow-lg"
              >
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingOverlay;