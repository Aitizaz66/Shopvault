
const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Shipping", icon: "📍" },
    { id: 2, label: "Payment", icon: "💳" },
    { id: 3, label: "Confirm", icon: "✅" },
  ];

  return (
    <div className="py-4">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step.id < currentStep
                    ? "bg-green-500 text-white"
                    : step.id === currentStep
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id < currentStep ? "✓" : step.icon}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  step.id <= currentStep ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-1 mx-2 ${
                  step.id < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
