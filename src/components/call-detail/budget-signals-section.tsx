"use client"

interface BudgetSignalsSectionProps {
  budgetSignals: string[]
  stretchIndicators: string[]
}

export function BudgetSignalsSection({
  budgetSignals,
  stretchIndicators,
}: BudgetSignalsSectionProps) {
  return (
    <div className="bg-white border border-navy-200 rounded-xl p-6">
      <div>
        <h3 className="text-sm font-semibold text-navy-800 mb-3">
          Budget Signals Detected
        </h3>
        {budgetSignals.length === 0 ? (
          <p className="text-sm text-navy-300">
            No signals detected for this call.
          </p>
        ) : (
          <ul className="space-y-2">
            {budgetSignals.map((signal, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span className="text-sm text-navy-600">{signal}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-navy-200 my-6" />

      <div>
        <h3 className="text-sm font-semibold text-navy-800 mb-3">
          Stretch Indicators
        </h3>
        {stretchIndicators.length === 0 ? (
          <p className="text-sm text-navy-300">
            No signals detected for this call.
          </p>
        ) : (
          <ul className="space-y-2">
            {stretchIndicators.map((indicator, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span className="text-sm text-navy-600">{indicator}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
