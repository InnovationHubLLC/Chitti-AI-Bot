interface ProgressBarProps {
  currentStep: number;
}

const STEPS = [
  { number: 1, label: "Business Info" },
  { number: 2, label: "Review Content" },
  { number: 3, label: "Hours & Calendar" },
  { number: 4, label: "Test Call" },
];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${
                    step.number === currentStep
                      ? "bg-accent-500 text-white"
                      : step.number < currentStep
                      ? "bg-accent-500/20 text-accent-700"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                {step.number}
              </div>
              <div
                className={`
                  mt-2 text-xs sm:text-sm font-medium text-center transition-colors
                  ${
                    step.number === currentStep
                      ? "text-accent-700"
                      : step.number < currentStep
                      ? "text-accent-600"
                      : "text-gray-500"
                  }
                `}
              >
                {step.label}
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-4 mb-8">
                <div
                  className={`
                    h-full transition-colors
                    ${
                      step.number < currentStep
                        ? "bg-accent-500"
                        : "bg-gray-200"
                    }
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
