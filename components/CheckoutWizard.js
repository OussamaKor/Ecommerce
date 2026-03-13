import React from 'react';

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className="mb-8 flex w-full items-center justify-between">
      {['Shipping Address', 'Place Order'].map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        return (
          <div key={step} className="flex-1">
            <div
              className={`mx-2 border-b-2 pb-2 text-center text-sm font-medium transition
                ${
                  isActive
                    ? 'border-stone-800 text-stone-600'
                    : isCompleted
                    ? 'border-stone-400 text-stone-400'
                    : 'border-gray-200 text-gray-400'
                }`}
            >
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
}

