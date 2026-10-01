import { convertLength, formatAngle, formatLength, formatLengthValue, formatCalculationResult, formatCalculationSubstitution, getTriangleVertices, solveTriangle, classifyTriangle } from '../triangle.ts';
import { getDiagramSolutions } from '../triangleDiagram.ts';
import { appRoutes, educationalSectionNavigation, learnInformationArchitecture, legalPageRoutes, prerenderedRoutes, productNavigation } from '../routes.ts';
import { getPageMetadata } from '../seo.ts';
import { triangleSidesFromAngles } from '../triangleBasicsGeometry.ts';

interface TestCase {
  name: string;
  input: { a: number | null; b: number | null; c: number | null; alpha: number | null; beta: number | null; gamma: number | null };
  expectKind: 'solved' | 'multiple' | 'insufficient' | 'invalid' | 'contradictory';
  check?: (result: ReturnType<typeof solveTriangle>) => boolean;
}

const DEG_TOL = 0.5;
const LEN_TOL = 0.5;

function approx(a: number, b: number, tol: number): boolean {
  return Math.abs(a - b) < tol;
}

const cases: TestCase[] = [
  // 1. Three known sides (SSS)
  {
    name: 'SSS: a=10, b=15, c=20',
    input: { a: 10, b: 15, c: 20, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && approx(r.status.solution.alpha + r.status.solution.beta + r.status.solution.gamma, 180, 0.01),
  },
  // 2. Two sides + included angle (SAS)
  {
    name: 'SAS: a=10, b=15, γ=60',
    input: { a: 10, b: 15, c: null, alpha: null, beta: null, gamma: 60 },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && r.method === 'SAS',
  },
  // 3. One side + two angles (ASA)
  {
    name: 'ASA: a=10, α=40, β=60',
    input: { a: 10, b: null, c: null, alpha: 40, beta: 60, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && approx(r.status.solution.gamma, 80, DEG_TOL),
  },
  // 4. Right triangle
  {
    name: 'Right: a=3, b=4, γ=90',
    input: { a: 3, b: 4, c: null, alpha: null, beta: null, gamma: 90 },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && approx(r.status.solution.c, 5, LEN_TOL),
  },
  // 5. Acute triangle
  {
    name: 'Acute: a=7, b=8, c=9',
    input: { a: 7, b: 8, c: 9, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && classifyTriangle(r.status.solution).angle === 'acute',
  },
  // 6. Obtuse triangle
  {
    name: 'Obtuse: a=3, b=4, c=6',
    input: { a: 3, b: 4, c: 6, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && classifyTriangle(r.status.solution).angle === 'obtuse',
  },
  // 7. Equilateral triangle
  {
    name: 'Equilateral: a=b=c=10',
    input: { a: 10, b: 10, c: 10, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && classifyTriangle(r.status.solution).side === 'equilateral',
  },
  // 8. Isosceles triangle
  {
    name: 'Isosceles: a=b=10, c=15',
    input: { a: 10, b: 10, c: 15, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && classifyTriangle(r.status.solution).side === 'isosceles',
  },
  // 9. Invalid side lengths (triangle inequality)
  {
    name: 'Invalid SSS: a=1, b=2, c=10',
    input: { a: 1, b: 2, c: 10, alpha: null, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  // 10. Impossible angles
  {
    name: 'Impossible angles: α=100, β=100',
    input: { a: 10, b: null, c: null, alpha: 100, beta: 100, gamma: null },
    expectKind: 'invalid',
  },
  // 11. Insufficient information
  {
    name: 'Insufficient: a=10, b=15',
    input: { a: 10, b: 15, c: null, alpha: null, beta: null, gamma: null },
    expectKind: 'insufficient',
  },
  // 12. SSA with one solution
  {
    name: 'SSA one solution: a=10, b=8, α=40',
    input: { a: 10, b: 8, c: null, alpha: 40, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && r.method === 'SSA',
  },
  // 13. SSA with two solutions
  {
    name: 'SSA two solutions: a=8, b=10, α=40',
    input: { a: 8, b: 10, c: null, alpha: 40, beta: null, gamma: null },
    expectKind: 'multiple',
  },
  // 14. SSA with no solution
  {
    name: 'SSA no solution: a=3, b=10, α=30',
    input: { a: 3, b: 10, c: null, alpha: 30, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  // 15. Three angles only (no sides)
  {
    name: 'Three angles only: α=60, β=60, γ=60',
    input: { a: null, b: null, c: null, alpha: 60, beta: 60, gamma: 60 },
    expectKind: 'insufficient',
  },
  // 16. AAS case (side + non-adjacent angle + another angle)
  {
    name: 'AAS: a=10, α=40, γ=80',
    input: { a: 10, b: null, c: null, alpha: 40, beta: null, gamma: 80 },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && approx(r.status.solution.beta, 60, DEG_TOL),
  },
  // 17. Very small triangle
  {
    name: 'Very small: a=0.01, b=0.02, c=0.03... no, valid: 0.1, 0.15, 0.2',
    input: { a: 0.1, b: 0.15, c: 0.2, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
  },
  // 18. Very large triangle
  {
    name: 'Very large: a=10000, b=15000, c=20000',
    input: { a: 10000, b: 15000, c: 20000, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
  },
  {
    name: 'Extremely large finite side lengths are rejected safely',
    input: { a: 1e200, b: 1.5e200, c: 2e200, alpha: null, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  {
    name: 'Extremely small positive side lengths are rejected safely',
    input: { a: 1e-200, b: 1.5e-200, c: 2e-200, alpha: null, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  {
    name: 'Extremely different side scales are rejected safely',
    input: { a: 1e150, b: 1e140, c: 1e150, alpha: null, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  {
    name: 'Small, uniformly scaled finite triangle remains supported',
    input: { a: 1e-150, b: 1e-150, c: 1e-150, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
  },
  // 19. SAS with different sides
  {
    name: 'SAS: a=5, c=8, β=45',
    input: { a: 5, b: null, c: 8, alpha: null, beta: 45, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && r.method === 'SAS',
  },
  // 20. SAS third variant
  {
    name: 'SAS: b=6, c=9, α=50',
    input: { a: null, b: 6, c: 9, alpha: 50, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && r.method === 'SAS',
  },
  // 21. Right triangle with legs and find hypotenuse - classic 3-4-5
  {
    name: 'Right 3-4-5 via two legs (SAS with γ=90)',
    input: { a: 3, b: 4, c: null, alpha: null, beta: null, gamma: 90 },
    expectKind: 'solved',
    check: (r) => {
      if (r.status.kind !== 'solved') return false;
      const s = r.status.solution;
      return approx(s.c, 5, 0.01) && approx(s.alpha, 36.87, 0.1) && approx(s.beta, 53.13, 0.1);
    },
  },
  // 22. Negative side
  {
    name: 'Negative side: a=-5, b=10, c=12',
    input: { a: -5, b: 10, c: 12, alpha: null, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  // 23. Zero side
  {
    name: 'Zero side: a=0, b=10, c=12',
    input: { a: 0, b: 10, c: 12, alpha: null, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  {
    name: 'NaN is invalid, not missing',
    input: { a: Number.NaN, b: 10, c: 12, alpha: null, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  {
    name: 'Infinity is invalid, not missing',
    input: { a: Number.POSITIVE_INFINITY, b: 10, c: 12, alpha: null, beta: null, gamma: null },
    expectKind: 'invalid',
  },
  {
    name: 'Invalid three sides rejected even with an angle',
    input: { a: 5, b: 7, c: 1, alpha: 30, beta: null, gamma: null },
    expectKind: 'invalid',
    check: (r) => r.status.kind === 'invalid' && r.status.message === 'The three side lengths cannot form a triangle. The sum of any two sides must be greater than the third side.',
  },
  {
    name: 'Valid three sides with consistent extra angle',
    input: { a: 5, b: 7, c: 8, alpha: 38.2132107, beta: null, gamma: null },
    expectKind: 'solved',
  },
  {
    name: 'Valid three sides with conflicting extra angle',
    input: { a: 5, b: 7, c: 8, alpha: 30, beta: null, gamma: null },
    expectKind: 'contradictory',
  },
  {
    name: 'Three-four-five right triangle',
    input: { a: 3, b: 4, c: 5, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && approx(r.status.solution.alpha, 36.87, 0.01) && approx(r.status.solution.beta, 53.13, 0.01) && approx(r.status.solution.gamma, 90, 0.01),
  },
  {
    name: 'Right triangle with scaled three sides',
    input: { a: 6, b: 8, c: 10, alpha: null, beta: null, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && approx(r.status.solution.gamma, 90, 0.01),
  },
  {
    name: 'One side is insufficient',
    input: { a: 5, b: null, c: null, alpha: null, beta: null, gamma: null },
    expectKind: 'insufficient',
  },
  {
    name: 'Two sides and right angle solve correctly',
    input: { a: 3, b: 4, c: null, alpha: null, beta: null, gamma: 90 },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && approx(r.status.solution.c, 5, 0.01),
  },
  {
    name: 'Two angles and side b solve remaining values',
    input: { a: null, b: 5, c: null, alpha: 40, beta: 60, gamma: null },
    expectKind: 'solved',
    check: (r) => r.status.kind === 'solved' && approx(r.status.solution.gamma, 80, 0.01) && r.status.solution.a > 0 && r.status.solution.c > 0,
  },
];

let passed = 0;
let failed = 0;

for (const tc of cases) {
  const result = solveTriangle(tc.input);
  const kindOk = result.status.kind === tc.expectKind;
  const checkOk = tc.check ? tc.check(result) : true;

  if (kindOk && checkOk) {
    passed++;
    console.log(`  ✓ ${tc.name}`);
  } else {
    failed++;
    console.log(`  ✗ ${tc.name}`);
    console.log(`    expected: ${tc.expectKind}, got: ${result.status.kind}`);
    if (!checkOk) console.log(`    check function failed`);
    if (result.status.kind === 'solved') {
      const s = result.status.solution;
      console.log(`    a=${s.a.toFixed(4)}, b=${s.b.toFixed(4)}, c=${s.c.toFixed(4)}, α=${s.alpha.toFixed(4)}, β=${s.beta.toFixed(4)}, γ=${s.gamma.toFixed(4)}`);
    } else if (result.status.kind === 'multiple') {
      console.log(`    two solutions found`);
    } else {
      console.log(`    message: ${(result.status as { message: string }).message}`);
    }
  }
}

const twoSolutionResult = solveTriangle({
  a: 5, b: 7, c: null, alpha: 30, beta: null, gamma: null,
});
const diagramSolutions = getDiagramSolutions(twoSolutionResult);
const forwardsBothSolutions = twoSolutionResult.status.kind === 'multiple'
  && diagramSolutions.length === 2
  && diagramSolutions[0] === twoSolutionResult.status.solutions[0]
  && diagramSolutions[1] === twoSolutionResult.status.solutions[1];
if (forwardsBothSolutions) {
  passed++;
  console.log('  ✓ Diagram receives both SSA solutions');
} else {
  failed++;
  console.log('  ✗ Diagram receives both SSA solutions');
}

const diagramsAreGeometricallyDistinct = diagramSolutions.length === 2 && diagramSolutions.every((solution) => {
  const { A, B, C } = getTriangleVertices(solution);
  const distance = (p: { x: number; y: number }, q: { x: number; y: number }) =>
    Math.hypot(p.x - q.x, p.y - q.y);
  return approx(distance(A, B), solution.c, 1e-8)
    && approx(distance(A, C), solution.b, 1e-8)
    && approx(distance(B, C), solution.a, 1e-8);
}) && Math.abs(diagramSolutions[0].c - diagramSolutions[1].c) > 1;
if (diagramsAreGeometricallyDistinct) {
  passed++;
  console.log('  ✓ Both SSA diagrams preserve their distinct side lengths');
} else {
  failed++;
  console.log('  ✗ Both SSA diagrams preserve their distinct side lengths');
}

const unitChecks: { name: string; passed: boolean }[] = [
  { name: '5 cm converts to about 1.97 inch', passed: approx(convertLength(5, 'cm', 'inch'), 1.9685039, 1e-6) && formatLengthValue(5, 'inch') === '1.97' },
  { name: '5 inch converts to 12.7 cm', passed: approx(convertLength(5, 'inch', 'cm'), 12.7, 1e-10) },
  { name: 'Calculated lengths format in the selected unit', passed: formatLength(5, 'cm') === '5.00 cm' && formatLength(5, 'inch') === '1.97 inch' },
  { name: 'Unit changes do not alter angles or canonical solved sides', passed: (() => {
    const result = solveTriangle({ a: 3, b: 4, c: 5, alpha: null, beta: null, gamma: null });
    return result.status.kind === 'solved'
      && approx(result.status.solution.alpha, 36.8698976, 1e-6)
      && approx(result.status.solution.beta, 53.1301024, 1e-6)
      && result.status.solution.gamma === 90
      && formatLength(result.status.solution.a, 'inch') === '1.18 inch'
      && formatLength(result.status.solution.b, 'inch') === '1.57 inch'
      && formatLength(result.status.solution.c, 'inch') === '1.97 inch';
  })() },
  { name: 'Repeated unit switches preserve the canonical value', passed: (() => {
    const canonicalCm = 5;
    let shown = formatLengthValue(canonicalCm, 'inch');
    shown = formatLengthValue(canonicalCm, 'cm');
    shown = formatLengthValue(canonicalCm, 'inch');
    shown = formatLengthValue(canonicalCm, 'cm');
    return shown === '5.00' && canonicalCm === 5;
  })() },
  { name: 'Empty length fields remain empty when formatted', passed: formatLengthValue(null, 'inch') === '' },
];

for (const check of unitChecks) {
  if (check.passed) {
    passed++;
    console.log(`  ✓ ${check.name}`);
  } else {
    failed++;
    console.log(`  ✗ ${check.name}`);
  }
}

const explanationChecks: { name: string; passed: boolean }[] = [
  {
    name: 'SSS explanation uses cosine rule and carries the calculated alpha value',
    passed: (() => {
      const r = solveTriangle({ a: 3, b: 4, c: 5, alpha: null, beta: null, gamma: null });
      return r.status.kind === 'solved'
        && r.status.explanation.method === 'cosine-rule'
        && r.status.explanation.steps[0].formula.includes('cos⁻¹')
        && approx(r.status.explanation.steps[0].resultValue, r.status.solution.alpha, 1e-10);
    })(),
  },
  {
    name: 'SAS right triangle explanation documents cosine rule without inventing Pythagoras',
    passed: (() => {
      const r = solveTriangle({ a: 3, b: 4, c: null, alpha: null, beta: null, gamma: 90 });
      return r.status.kind === 'solved'
        && r.status.explanation.method === 'cosine-rule'
        && r.status.explanation.steps[0].formula.includes('cos(gamma)')
        && approx(r.status.explanation.steps[0].resultValue, r.status.solution.c, 1e-10);
    })(),
  },
  {
    name: 'ASA explanation includes the actual angle sum and sine-rule side results',
    passed: (() => {
      const r = solveTriangle({ a: null, b: 5, c: null, alpha: 40, beta: 60, gamma: null });
      return r.status.kind === 'solved'
        && r.status.explanation.steps[0].formula.includes('180°')
        && r.status.explanation.steps.some((step) => step.formula.includes('sin(') && step.resultLabel === 'c')
        && approx(r.status.solution.gamma, 80, 1e-10);
    })(),
  },
  {
    name: 'AAS explanation uses the entered angles and solved values',
    passed: (() => {
      const r = solveTriangle({ a: 10, b: null, c: null, alpha: 40, beta: null, gamma: 80 });
      return r.status.kind === 'solved'
        && r.status.explanation.steps[0].resultLabel === 'beta'
        && approx(r.status.explanation.steps[0].resultValue, r.status.solution.beta, 1e-10);
    })(),
  },
  {
    name: 'Single SSA explanation reflects its solver result',
    passed: (() => {
      const r = solveTriangle({ a: 10, b: 8, c: null, alpha: 40, beta: null, gamma: null });
      return r.status.kind === 'solved'
        && r.status.explanation.method === 'ssa'
        && r.status.explanation.steps[r.status.explanation.steps.length - 1]?.resultLabel === 'c'
        && approx(r.status.explanation.steps[r.status.explanation.steps.length - 1].resultValue, r.status.solution.c, 1e-10);
    })(),
  },
  {
    name: 'Two SSA solutions each carry their own distinct trace',
    passed: (() => {
      const r = solveTriangle({ a: 5, b: 7, c: null, alpha: 30, beta: null, gamma: null });
      if (r.status.kind !== 'multiple') return false;
      const [first, second] = r.status.explanations;
      return first !== second
        && first.method === 'ssa' && second.method === 'ssa'
        && first.steps !== second.steps
        && approx(first.steps[first.steps.length - 1].resultValue, r.status.solutions[0].c, 1e-10)
        && approx(second.steps[second.steps.length - 1].resultValue, r.status.solutions[1].c, 1e-10)
        && Math.abs(first.steps[1].resultValue - second.steps[1].resultValue) > 1;
    })(),
  },
  {
    name: 'Unexplained validation errors stay plain while a detected angle conflict carries details',
    passed: (() => {
      const impossible = solveTriangle({ a: 3, b: 10, c: null, alpha: 30, beta: null, gamma: null });
      const invalid = solveTriangle({ a: -5, b: 7, c: 8, alpha: null, beta: null, gamma: null });
      const conflict = solveTriangle({ a: 5, b: 7, c: 8, alpha: 30, beta: null, gamma: null });
      return impossible.status.kind === 'invalid' && !('explanation' in impossible.status)
        && invalid.status.kind === 'invalid' && !('explanation' in invalid.status)
        && conflict.status.kind === 'contradictory' && conflict.status.explanation?.kind === 'angle-conflict';
    })(),
  },
];

function visibleExplanationText(explanation: NonNullable<Extract<ReturnType<typeof solveTriangle>['status'], { kind: 'solved' }>['explanation']>, unit: 'cm' | 'inch'): string {
  return explanation.steps.map((step) => `${formatCalculationSubstitution(step, unit)} ${step.resultLabel} = ${formatCalculationResult(step, unit)}`).join(' ');
}

const explanationFormattingChecks: { name: string; passed: boolean }[] = [
  {
    name: 'Visible explanations use at most two decimals for SSS, SAS, ASA/AAS, SSA and right-angle cases',
    passed: (() => {
      const inputs = [
        { a: 3, b: 4, c: 5, alpha: null, beta: null, gamma: null },
        { a: 3, b: 4, c: null, alpha: null, beta: null, gamma: 90 },
        { a: null, b: 5, c: null, alpha: 40, beta: 60, gamma: null },
        { a: 10, b: null, c: null, alpha: 40, beta: null, gamma: 80 },
        { a: 5, b: 7, c: null, alpha: 30, beta: null, gamma: null },
        { a: 4, b: 8, c: null, alpha: 30, beta: null, gamma: null },
      ];
      const explanations = inputs.flatMap((input) => {
        const result = solveTriangle(input);
        return result.status.kind === 'solved'
          ? [result.status.explanation]
          : result.status.kind === 'multiple' ? result.status.explanations : [];
      });
      return explanations.length === 7
        && explanations.every((explanation) => !/\d+\.\d{3,}/.test(visibleExplanationText(explanation, 'cm')));
    })(),
  },
  {
    name: 'Both SSA solutions show rounded angles while retaining full-precision solver values',
    passed: (() => {
      const result = solveTriangle({ a: 5, b: 7, c: null, alpha: 30, beta: null, gamma: null });
      if (result.status.kind !== 'multiple') return false;
      const [first, second] = result.status.explanations;
      const firstText = visibleExplanationText(first, 'cm');
      const secondText = visibleExplanationText(second, 'cm');
      return firstText.includes('44.43°')
        && secondText.includes('135.57°')
        && firstText.includes('105.57°')
        && secondText.includes('14.43°')
        && result.status.solutions[0].beta !== Number(result.status.solutions[0].beta.toFixed(2));
    })(),
  },
  {
    name: 'Explanation side substitutions and results follow cm/inch display formatting',
    passed: (() => {
      const result = solveTriangle({ a: 3, b: 4, c: 5, alpha: null, beta: null, gamma: null });
      if (result.status.kind !== 'solved') return false;
      const cmText = visibleExplanationText(result.status.explanation, 'cm');
      const inchText = visibleExplanationText(result.status.explanation, 'inch');
      return cmText.includes('3.00') && inchText.includes('1.18') && inchText.includes('1.57')
        && inchText.includes('1.97') && !/\d+\.\d{3,}/.test(inchText)
        && result.status.explanation.steps[0].substitutionValues[0].value === 4;
    })(),
  },
];

const errorExplanationChecks: { name: string; passed: boolean }[] = [
  {
    name: 'Triangle inequality details identify longest side and exact failing sum in all side orders',
    passed: (() => {
      const first = solveTriangle({ a: 5, b: 7, c: 1, alpha: null, beta: null, gamma: null });
      const second = solveTriangle({ a: 3, b: 4, c: 8, alpha: null, beta: null, gamma: null });
      const third = solveTriangle({ a: 8, b: 3, c: 4, alpha: null, beta: null, gamma: null });
      return first.status.kind === 'invalid' && first.status.explanation?.kind === 'triangle-inequality'
        && first.status.explanation.longestSide.side === 'b' && first.status.explanation.longestSide.value === 7
        && first.status.explanation.otherSides[0].value === 5 && first.status.explanation.otherSides[1].value === 1
        && first.status.explanation.sum === 6 && first.status.explanation.comparison === 'less-than'
        && second.status.kind === 'invalid' && second.status.explanation?.kind === 'triangle-inequality'
        && second.status.explanation.longestSide.side === 'c' && second.status.explanation.longestSide.value === 8
        && second.status.explanation.sum === 7
        && third.status.kind === 'invalid' && third.status.explanation?.kind === 'triangle-inequality'
        && third.status.explanation.longestSide.side === 'a' && third.status.explanation.sum === 7;
    })(),
  },
  {
    name: 'Triangle inequality equality boundary is explained as equal, not less than',
    passed: (() => {
      const result = solveTriangle({ a: 5, b: 5, c: 10, alpha: null, beta: null, gamma: null });
      return result.status.kind === 'invalid'
        && result.status.explanation?.kind === 'triangle-inequality'
        && result.status.explanation.sum === 10
        && result.status.explanation.comparison === 'equal-to';
    })(),
  },
  {
    name: 'Angle conflict details preserve solver values and use the calculator angle rounding',
    passed: (() => {
      const result = solveTriangle({ a: 5, b: 7, c: 8, alpha: 30, beta: null, gamma: null });
      return result.status.kind === 'contradictory'
        && result.status.explanation?.kind === 'angle-conflict'
        && result.status.explanation.angle === 'alpha'
        && approx(result.status.explanation.calculatedAngle, 38.2132107, 1e-6)
        && result.status.explanation.enteredAngle === 30
        && formatAngle(result.status.explanation.calculatedAngle) === '38.21°'
        && result.status.explanation.calculatedAngle !== 38.21;
    })(),
  },
  {
    name: 'Error explanation lengths follow the selected cm or inch display unit',
    passed: (() => {
      const result = solveTriangle({ a: 5, b: 7, c: 1, alpha: null, beta: null, gamma: null });
      return result.status.kind === 'invalid'
        && result.status.explanation?.kind === 'triangle-inequality'
        && formatLength(result.status.explanation.longestSide.value, 'cm') === '7.00 cm'
        && formatLength(result.status.explanation.longestSide.value, 'inch') === '2.76 inch'
        && formatLength(result.status.explanation.sum, 'inch') === '2.36 inch';
    })(),
  },
  {
    name: 'Valid solved result keeps its normal calculation explanation and insufficient input has no error explanation',
    passed: (() => {
      const solved = solveTriangle({ a: 3, b: 4, c: 5, alpha: null, beta: null, gamma: null });
      const insufficient = solveTriangle({ a: 5, b: null, c: null, alpha: null, beta: null, gamma: null });
      return solved.status.kind === 'solved'
        && solved.status.explanation.method === 'cosine-rule'
        && insufficient.status.kind === 'insufficient'
        && !('explanation' in insufficient.status);
    })(),
  },
];

const informationArchitectureChecks: { name: string; passed: boolean }[] = [
  {
    name: 'Product navigation exposes Calculator and Triangle Basics as active destinations',
    passed: productNavigation.length === 4
      && productNavigation[0].key === 'calculator'
      && productNavigation[0].href === appRoutes.calculator
      && productNavigation[0].state === 'available'
      && productNavigation[1].key === 'learn'
      && productNavigation[1].href === appRoutes.learnTriangleBasics
      && productNavigation[1].state === 'available'
      && productNavigation.slice(2).every((item) => item.state === 'coming-soon' && !('href' in item)),
  },
  {
    name: 'Current routes and prerender allowlist include homepage, legal pages and Triangle Basics',
    passed: appRoutes.calculator === '/'
      && appRoutes.learnTriangleBasics === '/learn/triangle-basics'
      && Object.keys(legalPageRoutes).sort().join(',') === '/contact,/imprint,/privacy'
      && [...prerenderedRoutes].sort().join(',') === '/,/contact,/imprint,/learn/triangle-basics,/privacy',
  },
  {
    name: 'Triangle Basics has dedicated indexable metadata while future Learn routes remain noindex',
    passed: getPageMetadata(appRoutes.learnTriangleBasics).title === 'Triangle Basics – Sides, Angles & Types of Triangles'
      && getPageMetadata(appRoutes.learnTriangleBasics).canonical === 'https://trianglecalc.com/learn/triangle-basics'
      && getPageMetadata(appRoutes.learnTriangleBasics).robots === 'index, follow'
      && getPageMetadata('/learn/cosine-rule').robots === 'noindex, nofollow'
      && getPageMetadata('/learn/cosine-rule').canonical === null,
  },
  {
    name: 'Existing educational section anchor navigation remains available outside the main product nav',
    passed: educationalSectionNavigation.map((item) => item.href).join(',') === '#how-it-works,#formulas,#faq',
  },
  {
    name: 'Triangle Basics lesson sections use the requested beginner learning order',
    passed: learnInformationArchitecture[0].items.join('|') === [
      'What Is a Triangle?',
      'Where Are Triangles Used?',
      'Why Do We Calculate Triangles?',
      'Sides and Angles',
      'Types of Triangles',
      'How Are Triangles Described?',
      'Try It Yourself',
    ].join('|'),
  },
  {
    name: 'Interactive learning triangle preserves its angle sum and opposite-side sine ratios',
    passed: (() => {
      const alpha = 60;
      const beta = 50;
      const gamma = 180 - alpha - beta;
      const sides = triangleSidesFromAngles(5, alpha, beta);
      const close = (left: number, right: number) => Math.abs(left - right) < 1e-10;
      return close(alpha + beta + gamma, 180)
        && close(sides.a / Math.sin(alpha * Math.PI / 180), sides.b / Math.sin(beta * Math.PI / 180))
        && close(sides.a / Math.sin(alpha * Math.PI / 180), sides.c / Math.sin(gamma * Math.PI / 180))
        && sides.a + sides.b > sides.c
        && sides.a + sides.c > sides.b
        && sides.b + sides.c > sides.a;
    })(),
  },
];

for (const check of explanationChecks) {
  if (check.passed) {
    passed++;
    console.log(`  ✓ ${check.name}`);
  } else {
    failed++;
    console.log(`  ✗ ${check.name}`);
  }
}

for (const check of explanationFormattingChecks) {
  if (check.passed) {
    passed++;
    console.log(`  ✓ ${check.name}`);
  } else {
    failed++;
    console.log(`  ✗ ${check.name}`);
  }
}

for (const check of errorExplanationChecks) {
  if (check.passed) {
    passed++;
    console.log(`  ✓ ${check.name}`);
  } else {
    failed++;
    console.log(`  ✗ ${check.name}`);
  }
}

for (const check of informationArchitectureChecks) {
  if (check.passed) {
    passed++;
    console.log(`  ✓ ${check.name}`);
  } else {
    failed++;
    console.log(`  ✗ ${check.name}`);
  }
}

console.log(`\n${passed}/${passed + failed} tests passed`);
if (failed > 0) {
  throw new Error(`${failed} test(s) failed`);
}
