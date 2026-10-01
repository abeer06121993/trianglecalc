import { formatAngle, formatLength, type CalculationExplanation, type Unit } from '../lib/triangle';
import { getTranslation } from '../lib/i18n';

export function CalculationExplanationView({ explanation, unit }: { explanation: CalculationExplanation; unit: Unit }) {
  const t = getTranslation();

  return (
    <details className="mt-4 border-t border-slate-100 pt-3">
      <summary className="cursor-pointer rounded-md text-sm font-medium text-blue-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        {t.calculationExplanationTitle}
      </summary>
      <ol className="mt-3 space-y-2">
        {explanation.steps.map((step, index) => (
          <li key={`${step.resultLabel}-${index}`} className="rounded-lg bg-slate-50 p-3 text-sm">
            <p className="font-medium text-slate-700">{index + 1}. {step.formula}</p>
            <p className="mt-1 break-words font-mono text-xs text-slate-500">{step.substitution}</p>
            <p className="mt-1 text-slate-800">
              {step.resultLabel} = {step.resultKind === 'length'
                ? formatLength(step.resultValue, unit)
                : formatAngle(step.resultValue)}
            </p>
          </li>
        ))}
      </ol>
    </details>
  );
}
