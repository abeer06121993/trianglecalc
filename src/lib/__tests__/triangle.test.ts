import { solveTriangle, classifyTriangle } from '../triangle';

interface TestCase {
  name: string;
  input: { a: number | null; b: number | null; c: number | null; alpha: number | null; beta: number | null; gamma: number | null };
  expectKind: 'solved' | 'multiple' | 'insufficient' | 'invalid';
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

console.log(`\n${passed}/${passed + failed} tests passed`);
if (failed > 0) {
  process.exit(1);
}
