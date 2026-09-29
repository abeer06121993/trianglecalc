import { useState, useCallback, useMemo, useEffect } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import {
  solveTriangle,
  classifyTriangle,
  formatLength,
  formatAngle,
  type TriangleInput,
  type Unit,
  type SolveResult,
  type TriangleSolution,
  type SolveMethod,
} from '@/lib/triangle';
import { getTranslation } from '@/lib/i18n';
import TriangleDiagram, { type HighlightKey } from './TriangleDiagram';

type FieldKey = 'a' | 'b' | 'c' | 'alpha' | 'beta' | 'gamma';

export default function TriangleCalculator() {
  const t = getTranslation();
  const [unit, setUnit] = useState<Unit>('cm');
  const [inputs, setInputs] = useState<TriangleInput>({
    a: null, b: null, c: null, alpha: null, beta: null, gamma: null,
  });
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({
    a: '', b: '', c: '', alpha: '', beta: '', gamma: '',
  });
  const [focusedField, setFocusedField] = useState<HighlightKey>(null);
  const [hoveredField, setHoveredField] = useState<HighlightKey>(null);

  // Live preview — always compute whenever inputs change
  const liveResult = useMemo(() => {
    const knownCount = Object.values(inputs).filter((v) => v !== null && v > 0).length;
    if (knownCount < 3) return null;
    return solveTriangle(inputs);
  }, [inputs]);

  // Track which keys the user has explicitly entered
  const knownKeys = useMemo(() => {
    const keys = new Set<string>();
    (['a', 'b', 'c', 'alpha', 'beta', 'gamma'] as const).forEach((k) => {
      if (rawInputs[k] !== '' && inputs[k] !== null && inputs[k]! > 0) {
        keys.add(k);
      }
    });
    return keys;
  }, [rawInputs, inputs]);

  const hasAnyValue = useMemo(() =>
    Object.values(rawInputs).some((v) => v !== ''),
    [rawInputs],
  );

  // The solution for the diagram (from live result)
  const diagramSolution = useMemo<TriangleSolution | null>(() => {
    if (!liveResult) return null;
    if (liveResult.status.kind === 'solved') return liveResult.status.solution;
    if (liveResult.status.kind === 'multiple') return liveResult.status.solutions[0];
    return null;
  }, [liveResult]);

  // Merge known values with calculated solution for display
  const displayValues = useMemo(() => {
    if (!diagramSolution) return null;
    return {
      a: { value: diagramSolution.a, known: knownKeys.has('a') },
      b: { value: diagramSolution.b, known: knownKeys.has('b') },
      c: { value: diagramSolution.c, known: knownKeys.has('c') },
      alpha: { value: diagramSolution.alpha, known: knownKeys.has('alpha') },
      beta: { value: diagramSolution.beta, known: knownKeys.has('beta') },
      gamma: { value: diagramSolution.gamma, known: knownKeys.has('gamma') },
    };
  }, [diagramSolution, knownKeys]);

  const highlight = hoveredField ?? focusedField;

  const handleInputChange = useCallback((key: string, value: string) => {
    setRawInputs((prev) => ({ ...prev, [key]: value }));
    setInputs((prev) => ({
      ...prev,
      [key]: value === '' ? null : parseFloat(value),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setInputs({ a: null, b: null, c: null, alpha: null, beta: null, gamma: null });
    setRawInputs({ a: '', b: '', c: '', alpha: '', beta: '', gamma: '' });
    setFocusedField(null);
    setHoveredField(null);
  }, []);

  const knownCount = knownKeys.size;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Unit selector bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-500">Triangle Calculator</span>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5" role="group" aria-label={t.unitLabel}>
          <button
            type="button"
            onClick={() => setUnit('cm')}
            className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
              unit === 'cm' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-pressed={unit === 'cm'}
          >
            cm
          </button>
          <button
            type="button"
            onClick={() => setUnit('inch')}
            className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
              unit === 'inch' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-pressed={unit === 'inch'}
          >
            inch
          </button>
        </div>
      </div>

      {/* Main connected area */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* LEFT: Inputs */}
        <div className="p-4 sm:p-6 lg:border-r border-slate-100 order-2 lg:order-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Calculation is live; button confirms/scrolls to results on mobile
            }}
            className="space-y-5"
            aria-label="Triangle calculator inputs"
          >
            {/* Side lengths */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{t.sidesTitle}</p>
              <div className="space-y-2.5">
                {(['a', 'b', 'c'] as const).map((key) => (
                  <InputRow
                    key={key}
                    fieldKey={key}
                    label={`Side ${key}`}
                    unitSuffix={unit}
                    value={rawInputs[key]}
                    onChange={(v) => handleInputChange(key, v)}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    onHover={(h) => setHoveredField(h)}
                    isCalculated={displayValues ? !displayValues[key].known : false}
                    calculatedValue={displayValues && !displayValues[key].known ? displayValues[key].value : null}
                    unit={unit}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Angles */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{t.anglesTitle}</p>
              <div className="space-y-2.5">
                {([
                  { key: 'alpha' as const, symbol: 'α' },
                  { key: 'beta' as const, symbol: 'β' },
                  { key: 'gamma' as const, symbol: 'γ' },
                ]).map(({ key, symbol }) => (
                  <InputRow
                    key={key}
                    fieldKey={key}
                    label={`Angle ${symbol}`}
                    unitSuffix="°"
                    value={rawInputs[key]}
                    onChange={(v) => handleInputChange(key, v)}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    onHover={(h) => setHoveredField(h)}
                    isCalculated={displayValues ? !displayValues[key].known : false}
                    calculatedValue={displayValues && !displayValues[key].known ? displayValues[key].value : null}
                    unit={unit}
                    isAngle
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm shadow-sm"
              >
                <CalcIcon className="w-4 h-4" aria-hidden="true" />
                Calculate Triangle
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 font-medium rounded-xl hover:bg-slate-100 focus:ring-4 focus:ring-slate-500/10 transition-all text-sm border border-slate-200"
                aria-label={t.reset}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                {t.reset}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Triangle + Results — one connected visual area */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50/60 to-slate-50/20 order-1 lg:order-2">
          {/* Triangle visualization */}
          <TriangleDiagram
            solution={diagramSolution}
            unit={unit}
            hasValues={hasAnyValue}
            highlight={highlight}
            knownKeys={knownKeys}
          />

          {/* Live feedback bar */}
          <div className="mt-3">
            <LiveFeedback
              knownCount={knownCount}
              result={liveResult}
              hasAnyValue={hasAnyValue}
            />
          </div>

          {/* Results — directly below triangle, same visual area */}
          {liveResult && (
            <div className="mt-4 space-y-3">
              {liveResult.status.kind === 'solved' && (
                <ResultPanel
                  solution={liveResult.status.solution}
                  unit={unit}
                  method={liveResult.method}
                  knownKeys={knownKeys}
                  title={t.resultTitle}
                />
              )}

              {liveResult.status.kind === 'multiple' && (
                <div className="space-y-3">
                  <ResultPanel
                    solution={liveResult.status.solutions[0]}
                    unit={unit}
                    method={liveResult.method}
                    knownKeys={knownKeys}
                    title={t.solution1}
                  />
                  <ResultPanel
                    solution={liveResult.status.solutions[1]}
                    unit={unit}
                    method={liveResult.method}
                    knownKeys={knownKeys}
                    title={t.solution2}
                  />
                  <p className="text-xs text-slate-500 italic px-1">{t.ambiguousNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Input row with inline unit and highlight interaction ---

function InputRow({
  fieldKey,
  label,
  unitSuffix,
  value,
  onChange,
  onFocus,
  onBlur,
  onHover,
  isCalculated,
  calculatedValue,
  unit,
  isAngle = false,
}: {
  fieldKey: FieldKey;
  label: string;
  unitSuffix: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onHover: (h: HighlightKey) => void;
  isCalculated: boolean;
  calculatedValue: number | null;
  unit: Unit;
  isAngle?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 group"
      onMouseEnter={() => onHover(fieldKey)}
      onMouseLeave={() => onHover(null)}
    >
      <label
        htmlFor={`input-${fieldKey}`}
        className="text-sm font-medium text-slate-700 w-20 flex-shrink-0 cursor-pointer"
      >
        {label}
      </label>
      <div className="relative flex-1">
        <input
          id={`input-${fieldKey}`}
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          {...(isAngle ? { max: '180' } : {})}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="—"
          className={`w-full px-3 py-2.5 text-base rounded-lg border outline-none transition-all text-slate-900 ${
            value !== ''
              ? 'border-slate-200 bg-white'
              : 'border-slate-150 bg-slate-50/50'
          } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:bg-white`}
          aria-label={label}
        />
      </div>
      <span className="text-sm text-slate-400 w-8 flex-shrink-0 text-left">
        {unitSuffix}
      </span>
      {/* Calculated indicator */}
      {isCalculated && calculatedValue !== null && (
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex-shrink-0">
          = {isAngle ? formatAngle(calculatedValue) : formatLength(calculatedValue, unit)}
        </span>
      )}
    </div>
  );
}

// --- Live feedback ---

function LiveFeedback({
  knownCount,
  result,
  hasAnyValue,
}: {
  knownCount: number;
  result: SolveResult | null;
  hasAnyValue: boolean;
}) {
  if (!hasAnyValue) {
    return (
      <p className="text-center text-xs text-slate-400">
        Enter the values you know — the triangle updates automatically.
      </p>
    );
  }

  if (knownCount < 3) {
    const needed = 3 - knownCount;
    return (
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span>
          {knownCount} {knownCount === 1 ? 'value' : 'values'} entered — {needed} more {needed === 1 ? 'value' : 'values'} needed
        </span>
      </div>
    );
  }

  if (!result) return null;

  if (result.status.kind === 'solved') {
    return (
      <div className="flex items-center justify-center gap-2 text-xs text-green-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span>Triangle can be solved — all values calculated</span>
      </div>
    );
  }

  if (result.status.kind === 'multiple') {
    return (
      <div className="flex items-center justify-center gap-2 text-xs text-amber-600">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>Two solutions possible — see both below</span>
      </div>
    );
  }

  if (result.status.kind === 'invalid') {
    return (
      <div className="flex items-center justify-center gap-2 text-xs text-red-500">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span>{result.status.message}</span>
      </div>
    );
  }

  if (result.status.kind === 'insufficient') {
    return (
      <div className="flex items-center justify-center gap-2 text-xs text-blue-500">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        <span>{result.status.message}</span>
      </div>
    );
  }

  return null;
}

// --- Result panel ---

function ResultPanel({
  solution,
  unit,
  method,
  knownKeys,
  title,
}: {
  solution: TriangleSolution;
  unit: Unit;
  method: SolveMethod;
  knownKeys: Set<string>;
  title: string;
}) {
  const t = getTranslation();
  const classification = classifyTriangle(solution);
  const typeLabel = `${classification.side} · ${classification.angle}`;

  const sideRows: { key: 'a' | 'b' | 'c'; label: string; value: number }[] = [
    { key: 'a', label: 'a', value: solution.a },
    { key: 'b', label: 'b', value: solution.b },
    { key: 'c', label: 'c', value: solution.c },
  ];

  const angleRows: { key: 'alpha' | 'beta' | 'gamma'; label: string; value: number }[] = [
    { key: 'alpha', label: 'α', value: solution.alpha },
    { key: 'beta', label: 'β', value: solution.beta },
    { key: 'gamma', label: 'γ', value: solution.gamma },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-400">
          {method && <span className="font-medium">{method}</span>}
          {method && ' · '}
          {typeLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.sidesResult}</p>
          <dl className="space-y-1.5">
            {sideRows.map((row) => (
              <div key={row.key} className="flex justify-between items-center text-sm">
                <dt className="text-slate-600">{row.label}</dt>
                <dd className="flex items-center gap-2">
                  {!knownKeys.has(row.key) && (
                    <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded font-medium">calc</span>
                  )}
                  <span className="font-medium text-slate-900">{formatLength(row.value, unit)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.anglesResult}</p>
          <dl className="space-y-1.5">
            {angleRows.map((row) => (
              <div key={row.key} className="flex justify-between items-center text-sm">
                <dt className="text-slate-600">{row.label}</dt>
                <dd className="flex items-center gap-2">
                  {!knownKeys.has(row.key) && (
                    <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded font-medium">calc</span>
                  )}
                  <span className="font-medium text-slate-900">{formatAngle(row.value)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
