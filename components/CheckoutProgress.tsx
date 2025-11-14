import React from 'react';

interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { number: 1, label: 'Payment\nFrequency' },
    { number: 2, label: 'Shipping' },
    { number: 3, label: 'Payment' },
  ];

  return (
    <div className="px-6 py-6 border-b border-gray-200">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-system-blue-light transition-all duration-300"
            style={{ 
              width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' 
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                isActive || isCompleted
                  ? 'bg-system-blue-light'
                  : 'bg-white border-2 border-gray-300'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-xs font-semibold ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.number}
                  </span>
                )}
              </div>
              <span className={`text-xs text-center whitespace-pre-line ${
                isActive ? 'text-system-blue-light font-semibold' : 'text-gray-500 font-medium'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}