// Calculation engine for solving triangles.
// Separated from UI so it can be tested and extended independently.

export type Unit = 'cm' | 'inch';

export const INCH_TO_CM = 2.54;

export interface TriangleInput {
  a: number | null;
  b: number | null;
  c: number | null;
  alpha: number | null; // angle opposite side a (degrees)
  beta: number | null;  // angle opposite side b (degrees)
  gamma: number | null; // angle opposite side c (degrees)
}

export interface TriangleSolution {
  a: number;
  b: number;
  c: number;
  alpha: number; // degrees
  beta: number;
  gamma: number;
}

export type SolutionStatus =
  | { kind: 'solved'; solution: TriangleSolution }
  | { kind: 'multiple'; solutions: [TriangleSolution, TriangleSolution] }
  | { kind: 'insufficient'; message: string }
  | { kind: 'contradictory'; message: string }
  | { kind: 'invalid'; message: string };

export type SolveMethod =
  | 'SSS'
  | 'SAS'
  | 'ASA'
  | 'AAS'
  | 'SSA'
  | 'Right-Angle'
  | null;

export interface SolveResult {
  status: SolutionStatus;
  method: SolveMethod;
}

// --- Helpers ---

const toRad = (deg: number): number => (deg * Math.PI) / 180;
const toDeg = (rad: number): number => (rad * 180) / Math.PI;

// The solver squares side lengths in the cosine rule. This range keeps those
// operations far from IEEE-754 overflow/underflow; the relative limit avoids
// losing the smaller squared side below floating-point precision.
export const MIN_SUPPORTED_SIDE_CM = 1e-150;
export const MAX_SUPPORTED_SIDE_CM = 1e150;
const MIN_SIDE_TO_MAX_SIDE_RATIO = Math.sqrt(Number.EPSILON);
const NUMERIC_RANGE_ERROR =
  'Side lengths are outside the supported numerical range (1e-150 to 1e150 cm) or differ too much in scale for reliable calculation.';

function angleFromCosine(sides: { a: number; b: number; c: number }, opposite: 'a' | 'b' | 'c'): number {
  const { a, b, c } = sides;
  if (opposite === 'a') return toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
  if (opposite === 'b') return toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
  return toDeg(Math.acos((a * a + b * b - c * c) / (2 * a * b)));
}

function thirdAngle(a1: number, a2: number): number {
  return 180 - a1 - a2;
}

function sideFromSineRule(knownSide: number, knownAngleDeg: number, targetAngleDeg: number): number {
  return (knownSide * Math.sin(toRad(targetAngleDeg))) / Math.sin(toRad(knownAngleDeg));
}

function sideFromCosineRule(a: number, b: number, gammaDeg: number): number {
  const g = toRad(gammaDeg);
  return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(g));
}

// --- Validation ---

function isPositiveSide(v: number | null): boolean {
  return v !== null && v > 0 && Number.isFinite(v);
}

function isValidAngle(v: number | null): boolean {
  return v !== null && v > 0 && v < 180 && Number.isFinite(v);
}

function triangleInequality(a: number, b: number, c: number): boolean {
  return a + b > c && a + c > b && b + c > a;
}

export function sideLengthsNumericallySafe(sides: number[]): boolean {
  if (sides.some((side) => !Number.isFinite(side) || side < MIN_SUPPORTED_SIDE_CM || side > MAX_SUPPORTED_SIDE_CM)) {
    return false;
  }
  const smallest = Math.min(...sides);
  const largest = Math.max(...sides);
  return smallest >= largest * MIN_SIDE_TO_MAX_SIDE_RATIO;
}

function solutionNumericallySafe(solution: TriangleSolution): boolean {
  const sides = [solution.a, solution.b, solution.c];
  const angles = [solution.alpha, solution.beta, solution.gamma];
  return sideLengthsNumericallySafe(sides)
    && angles.every((angle) => Number.isFinite(angle) && angle > 0 && angle < 180);
}

function solutionGeometryValid(solution: TriangleSolution): boolean {
  return solutionNumericallySafe(solution)
    && triangleInequality(solution.a, solution.b, solution.c)
    && anglesSumValid(solution.alpha, solution.beta, solution.gamma);
}

function anglesSumValid(a1: number, a2: number, a3: number): boolean {
  return Math.abs(a1 + a2 + a3 - 180) < 1e-6;
}

const ANGLE_CONSISTENCY_TOLERANCE_DEGREES = 0.1;

// --- Main solve function ---

export function solveTriangle(input: TriangleInput): SolveResult {
  // Reject non-finite values explicitly; they are invalid inputs, not missing values.
  for (const value of Object.values(input)) {
    if (value !== null && !Number.isFinite(value)) {
      return invalidResult('All entered values must be finite numbers.');
    }
  }

  const providedSides = [input.a, input.b, input.c].filter((value): value is number => value !== null);
  if (providedSides.some((side) => side <= 0)) {
    return invalidResult('Side lengths must be greater than zero.');
  }
  if (!sideLengthsNumericallySafe(providedSides)) {
    return invalidResult(NUMERIC_RANGE_ERROR);
  }

  const a = isPositiveSide(input.a) ? input.a! : null;
  const b = isPositiveSide(input.b) ? input.b! : null;
  const c = isPositiveSide(input.c) ? input.c! : null;
  const alpha = isValidAngle(input.alpha) ? input.alpha! : null;
  const beta = isValidAngle(input.beta) ? input.beta! : null;
  const gamma = isValidAngle(input.gamma) ? input.gamma! : null;

  // Validate provided sides (negative or zero values are invalid, not just empty)
  if (input.a !== null && input.a <= 0) {
    return invalidResult('Side lengths must be greater than zero.');
  }
  if (input.b !== null && input.b <= 0) {
    return invalidResult('Side lengths must be greater than zero.');
  }
  if (input.c !== null && input.c <= 0) {
    return invalidResult('Side lengths must be greater than zero.');
  }

  // Validate provided angles (out of range values are invalid)
  if (input.alpha !== null && (input.alpha <= 0 || input.alpha >= 180)) {
    return invalidResult('Angles must be between 0° and 180°.');
  }
  if (input.beta !== null && (input.beta <= 0 || input.beta >= 180)) {
    return invalidResult('Angles must be between 0° and 180°.');
  }
  if (input.gamma !== null && (input.gamma <= 0 || input.gamma >= 180)) {
    return invalidResult('Angles must be between 0° and 180°.');
  }

  // Three sides fully determine feasibility and shape, regardless of extra angles.
  if (a !== null && b !== null && c !== null) {
    if (!triangleInequality(a, b, c)) {
      return invalidResult('The three side lengths cannot form a triangle. The sum of any two sides must be greater than the third side.');
    }

    const sideDetermined: TriangleSolution = {
      a, b, c,
      alpha: angleFromCosine({ a, b, c }, 'a'),
      beta: angleFromCosine({ a, b, c }, 'b'),
      gamma: angleFromCosine({ a, b, c }, 'c'),
    };
    const providedAngles = [
      { name: 'alpha', provided: alpha, calculated: sideDetermined.alpha },
      { name: 'beta', provided: beta, calculated: sideDetermined.beta },
      { name: 'gamma', provided: gamma, calculated: sideDetermined.gamma },
    ];
    const conflict = providedAngles.find(({ provided, calculated }) =>
      provided !== null && Math.abs(provided - calculated) > ANGLE_CONSISTENCY_TOLERANCE_DEGREES,
    );
    if (conflict) {
      return contradictoryResult(`The entered ${conflict.name} conflicts with the angle determined by the three side lengths.`);
    }
    return solvedResult(sideDetermined, 'SSS');
  }

  const sideCount = [a, b, c].filter((s) => s !== null).length;
  const angleCount = [alpha, beta, gamma].filter((an) => an !== null).length;
  const known = sideCount + angleCount;

  // Check if we have enough data
  if (known < 3) {
    return insufficientResult('Please enter at least three known values (sides or angles) to determine the triangle.');
  }

  // Special case: 3 angles, no sides — only determines shape, not size
  if (sideCount === 0 && angleCount >= 3) {
    const a1 = alpha!;
    const a2 = beta!;
    const a3 = gamma!;
    if (!anglesSumValid(a1, a2, a3)) {
      return invalidResult('The three angles must add up to 180°.');
    }
    return insufficientResult('Three angles determine the shape but not the size. Please enter at least one side length.');
  }

  // --- SSS: Three sides ---
  // --- SAS: Two sides + included angle ---
  // a, b, γ included
  if (a && b && gamma && !alpha && !beta && !c) {
    const cCalc = sideFromCosineRule(a, b, gamma);
    const al = angleFromCosine({ a, b, c: cCalc }, 'a');
    const be = angleFromCosine({ a, b, c: cCalc }, 'b');
    return solvedResult({ a, b, c: cCalc, alpha: al, beta: be, gamma }, 'SAS');
  }
  // a, c, β included
  if (a && c && beta && !alpha && !gamma && !b) {
    const bCalc = sideFromCosineRule(a, c, beta);
    const al = angleFromCosine({ a, b: bCalc, c }, 'a');
    const ga = angleFromCosine({ a, b: bCalc, c }, 'c');
    return solvedResult({ a, b: bCalc, c, alpha: al, beta, gamma: ga }, 'SAS');
  }
  // b, c, α included
  if (b && c && alpha && !beta && !gamma && !a) {
    const aCalc = sideFromCosineRule(b, c, alpha);
    const be = angleFromCosine({ a: aCalc, b, c }, 'b');
    const ga = angleFromCosine({ a: aCalc, b, c }, 'c');
    return solvedResult({ a: aCalc, b, c, alpha, beta: be, gamma: ga }, 'SAS');
  }

  // --- ASA / AAS: One side + two angles ---
  // Two angles known — find the third from 180° sum
  if (angleCount >= 2 && sideCount >= 1) {
    let a1 = alpha, a2 = beta, a3 = gamma;
    const knownSide = a ? { side: 'a' as const, len: a } : b ? { side: 'b' as const, len: b } : c ? { side: 'c' as const, len: c } : null;

    if (!knownSide) return insufficientResult('Please enter at least one side length.');

    // Fill in the missing angle
    if (a1 !== null && a2 !== null && a3 === null) {
      a3 = thirdAngle(a1, a2);
      if (a3 <= 0) return invalidResult('The two given angles add up to 180° or more, leaving no room for the third angle.');
    } else if (a1 !== null && a3 !== null && a2 === null) {
      a2 = thirdAngle(a1, a3);
      if (a2 <= 0) return invalidResult('The two given angles add up to 180° or more, leaving no room for the third angle.');
    } else if (a2 !== null && a3 !== null && a1 === null) {
      a1 = thirdAngle(a2, a3);
      if (a1 <= 0) return invalidResult('The two given angles add up to 180° or more, leaving no room for the third angle.');
    } else if (a1 !== null && a2 !== null && a3 !== null) {
      if (!anglesSumValid(a1, a2, a3)) return invalidResult('The three angles must add up to 180°.');
    }

    if (a1 === null || a2 === null || a3 === null) {
      return insufficientResult('Please enter at least two angles.');
    }

    const knownAngle = knownSide.side === 'a' ? a1 : knownSide.side === 'b' ? a2 : a3;
    if (knownAngle === null) return insufficientResult('Please enter at least two angles and one side.');

    const aCalc = sideFromSineRule(knownSide.len, knownAngle, a1);
    const bCalc = sideFromSineRule(knownSide.len, knownAngle, a2);
    const cCalc = sideFromSineRule(knownSide.len, knownAngle, a3);

    return solvedResult({ a: aCalc, b: bCalc, c: cCalc, alpha: a1, beta: a2, gamma: a3 }, 'ASA');
  }

  // --- SSA: Two sides + non-included angle (ambiguous case) ---
  if (sideCount >= 2 && angleCount >= 1) {
    return solveSSA({ a, b, c, alpha, beta, gamma });
  }

  return insufficientResult('Not enough information to determine the triangle.');
}

interface SSAInput {
  a: number | null;
  b: number | null;
  c: number | null;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

function solveSSA(input: SSAInput): SolveResult {
  const { a, b, c, alpha, beta, gamma } = input;

  // Determine which pair of sides + non-included angle we have.
  // Case: a, b, α  (α opposite a, b adjacent)
  if (a && b && alpha && !beta && !gamma && !c) {
    return solveSSAPair(a, b, alpha, 'a', 'b', 'alpha');
  }
  // Case: a, b, β  (β opposite b, a adjacent)
  if (a && b && beta && !alpha && !gamma && !c) {
    return solveSSAPair(b, a, beta, 'b', 'a', 'beta');
  }
  // Case: a, c, α
  if (a && c && alpha && !beta && !gamma && !b) {
    return solveSSAPair(a, c, alpha, 'a', 'c', 'alpha');
  }
  // Case: a, c, γ
  if (a && c && gamma && !alpha && !beta && !b) {
    return solveSSAPair(c, a, gamma, 'c', 'a', 'gamma');
  }
  // Case: b, c, β
  if (b && c && beta && !alpha && !gamma && !a) {
    return solveSSAPair(b, c, beta, 'b', 'c', 'beta');
  }
  // Case: b, c, γ
  if (b && c && gamma && !alpha && !beta && !a) {
    return solveSSAPair(c, b, gamma, 'c', 'b', 'gamma');
  }

  // Combinations with extra known values beyond SSA
  // Two sides and one angle where the angle is actually included → already handled by SAS above.
  // If we have 2 sides + 1 angle but it doesn't match SSA patterns, check if included.
  return insufficientResult('The given combination of values is not sufficient or is ambiguous. Please enter another side or angle.');
}

/**
 * Solve the SSA (ambiguous) case.
 * @param oppositeSide  side opposite the known angle
 * @param adjacentSide  the other known side (adjacent to the known angle)
 * @param knownAngleDeg the known angle in degrees
 * @param oppositeLabel which side/angle labels are 'opposite' vs 'adjacent'
 * @param oppositeKey   label key for the opposite side ('a' | 'b' | 'c')
 * @param adjacentKey   label key for the adjacent side ('a' | 'b' | 'c')
 * @param angleKey      label key for the known angle ('alpha' | 'beta' | 'gamma')
 */
function solveSSAPair(
  oppositeSide: number,
  adjacentSide: number,
  knownAngleDeg: number,
  oppositeKey: 'a' | 'b' | 'c',
  adjacentKey: 'a' | 'b' | 'c',
  angleKey: 'alpha' | 'beta' | 'gamma',
): SolveResult {
  const h = adjacentSide * Math.sin(toRad(knownAngleDeg)); // height

  // If the known angle is >= 90°, only one solution possible
  if (knownAngleDeg >= 90) {
    if (oppositeSide < adjacentSide || oppositeSide <= h) {
      return invalidResult('These values cannot form a valid triangle. With an obtuse or right known angle, the opposite side must be longer than the adjacent side.');
    }
    // Exactly one solution
    const sinOther = (adjacentSide * Math.sin(toRad(knownAngleDeg))) / oppositeSide;
    const otherAngle = toDeg(Math.asin(sinOther));
    const thirdAngle = 180 - knownAngleDeg - otherAngle;
    if (thirdAngle <= 0) return invalidResult('These values cannot form a valid triangle.');
    return solvedResult(
      buildSolution(oppositeKey, adjacentKey, angleKey, oppositeSide, adjacentSide, knownAngleDeg, otherAngle, thirdAngle),
      'SSA',
    );
  }

  // Acute known angle
  if (oppositeSide < h) {
    // No solution
    return invalidResult('These values cannot form a valid triangle. The opposite side is too short to reach the base.');
  }

  if (Math.abs(oppositeSide - h) < 1e-10) {
    // Exactly one solution (right triangle)
    const otherAngle = 90;
    const thirdAngle = 90 - knownAngleDeg;
    return solvedResult(
      buildSolution(oppositeKey, adjacentKey, angleKey, oppositeSide, adjacentSide, knownAngleDeg, otherAngle, thirdAngle),
      'SSA',
    );
  }

  if (oppositeSide > adjacentSide) {
    // Exactly one solution
    const sinOther = (adjacentSide * Math.sin(toRad(knownAngleDeg))) / oppositeSide;
    const otherAngle = toDeg(Math.asin(sinOther));
    const thirdAngle = 180 - knownAngleDeg - otherAngle;
    if (thirdAngle <= 0) return invalidResult('These values cannot form a valid triangle.');
    return solvedResult(
      buildSolution(oppositeKey, adjacentKey, angleKey, oppositeSide, adjacentSide, knownAngleDeg, otherAngle, thirdAngle),
      'SSA',
    );
  }

  // h < oppositeSide < adjacentSide → two solutions
  const sinOther = (adjacentSide * Math.sin(toRad(knownAngleDeg))) / oppositeSide;
  const otherAngle1 = toDeg(Math.asin(sinOther));
  const thirdAngle1 = 180 - knownAngleDeg - otherAngle1;

  const otherAngle2 = 180 - otherAngle1;
  const thirdAngle2 = 180 - knownAngleDeg - otherAngle2;

  if (thirdAngle1 <= 0 || thirdAngle2 <= 0) {
    // Only one valid
    const validAngle = thirdAngle1 > 0 ? otherAngle1 : otherAngle2;
    const validThird = thirdAngle1 > 0 ? thirdAngle1 : thirdAngle2;
    return solvedResult(
      buildSolution(oppositeKey, adjacentKey, angleKey, oppositeSide, adjacentSide, knownAngleDeg, validAngle, validThird),
      'SSA',
    );
  }

  const sol1 = buildSolution(oppositeKey, adjacentKey, angleKey, oppositeSide, adjacentSide, knownAngleDeg, otherAngle1, thirdAngle1);
  const sol2 = buildSolution(oppositeKey, adjacentKey, angleKey, oppositeSide, adjacentSide, knownAngleDeg, otherAngle2, thirdAngle2);

  if (!solutionGeometryValid(sol1) || !solutionGeometryValid(sol2)) {
    return invalidResult(NUMERIC_RANGE_ERROR);
  }

  return {
    status: { kind: 'multiple', solutions: [sol1, sol2] },
    method: 'SSA',
  };
}

function buildSolution(
  oppositeKey: 'a' | 'b' | 'c',
  adjacentKey: 'a' | 'b' | 'c',
  angleKey: 'alpha' | 'beta' | 'gamma',
  oppositeSide: number,
  adjacentSide: number,
  knownAngle: number,
  otherAngle: number,
  thirdAngle: number,
): TriangleSolution {
  // Build a full solution object from the SSA components
  const sides: Record<'a' | 'b' | 'c', number> = { a: 0, b: 0, c: 0 };
  const angles: Record<'alpha' | 'beta' | 'gamma', number> = { alpha: 0, beta: 0, gamma: 0 };

  sides[angleKey === 'alpha' ? 'a' : angleKey === 'beta' ? 'b' : 'c'] = oppositeSide;
  sides[adjacentKey] = adjacentSide;

  angles[angleKey] = knownAngle;

  // The "otherAngle" is opposite the adjacentSide
  // The "thirdAngle" is opposite the third (unknown) side
  const angleForAdjacentKey: 'alpha' | 'beta' | 'gamma' =
    adjacentKey === 'a' ? 'alpha' : adjacentKey === 'b' ? 'beta' : 'gamma';
  angles[angleForAdjacentKey] = otherAngle;

  const thirdSideKey: 'a' | 'b' | 'c' = (['a', 'b', 'c'] as const).find((k) => sides[k] === 0)!;
  const thirdAngleKey: 'alpha' | 'beta' | 'gamma' =
    thirdSideKey === 'a' ? 'alpha' : thirdSideKey === 'b' ? 'beta' : 'gamma';
  angles[thirdAngleKey] = thirdAngle;

  // Compute the third side using sine rule
  const knownAngleForSine = knownAngle;
  const thirdSide = sideFromSineRule(oppositeSide, knownAngleForSine, thirdAngle);
  sides[thirdSideKey] = thirdSide;

  return {
    a: sides.a,
    b: sides.b,
    c: sides.c,
    alpha: angles.alpha,
    beta: angles.beta,
    gamma: angles.gamma,
  };
}

// --- Result constructors ---

function solvedResult(sol: TriangleSolution, method: SolveMethod): SolveResult {
  // Final validation
  if (!solutionNumericallySafe(sol)) {
    return invalidResult(NUMERIC_RANGE_ERROR);
  }
  if (!triangleInequality(sol.a, sol.b, sol.c)) {
    return invalidResult('The calculated values do not satisfy the triangle inequality.');
  }
  if (!anglesSumValid(sol.alpha, sol.beta, sol.gamma)) {
    return invalidResult('The calculated angles do not add up to 180°.');
  }
  return { status: { kind: 'solved', solution: sol }, method };
}

function insufficientResult(message: string): SolveResult {
  return { status: { kind: 'insufficient', message }, method: null };
}

function contradictoryResult(message: string): SolveResult {
  return { status: { kind: 'contradictory', message }, method: null };
}

function invalidResult(message: string): SolveResult {
  return { status: { kind: 'invalid', message }, method: null };
}

// --- Unit conversion ---

export function convertLength(value: number, from: Unit, to: Unit): number {
  if (from === to) return value;
  if (from === 'cm' && to === 'inch') return value / INCH_TO_CM;
  return value * INCH_TO_CM;
}

// --- Formatting ---

export function formatLength(value: number, unit: Unit, decimals = 2): string {
  return `${formatLengthValue(value, unit, decimals)} ${unit}`;
}

/** Formats a canonical centimeter value for an editable field in the selected unit. */
export function formatLengthValue(valueCm: number | null, unit: Unit, decimals = 2): string {
  if (valueCm === null) return '';
  return convertLength(valueCm, 'cm', unit).toFixed(decimals);
}

export function formatAngle(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}°`;
}

// --- Triangle classification ---

export type TriangleKind = 'equilateral' | 'isosceles' | 'scalene' | 'right' | 'acute' | 'obtuse';

export function classifyTriangle(sol: TriangleSolution): { side: 'equilateral' | 'isosceles' | 'scalene'; angle: 'right' | 'acute' | 'obtuse' } {
  const sides = [sol.a, sol.b, sol.c].sort((x, y) => x - y);
  const angles = [sol.alpha, sol.beta, sol.gamma].sort((x, y) => x - y);

  const isEquilateral = Math.abs(sides[0] - sides[2]) < 1e-6;
  const isIsosceles = !isEquilateral && (
    Math.abs(sides[0] - sides[1]) < 1e-6 ||
    Math.abs(sides[1] - sides[2]) < 1e-6 ||
    Math.abs(sides[0] - sides[2]) < 1e-6
  );

  const maxAngle = angles[2];
  const isRight = Math.abs(maxAngle - 90) < 0.01;
  const isObtuse = maxAngle > 90;

  return {
    side: isEquilateral ? 'equilateral' : isIsosceles ? 'isosceles' : 'scalene',
    angle: isRight ? 'right' : isObtuse ? 'obtuse' : 'acute',
  };
}

// --- Triangle vertices for visualization ---

export function getTriangleVertices(sol: TriangleSolution): {
  A: { x: number; y: number };
  B: { x: number; y: number };
  C: { x: number; y: number };
} {
  // Place side c (AB) along the baseline.
  // Vertex A at origin, vertex B at (c, 0).
  // Vertex C is found from angle α at vertex A.
  const c = sol.c;
  const alphaRad = toRad(sol.alpha);
  const b = sol.b; // side b is opposite angle β, so b = AC

  const A = { x: 0, y: 0 };
  const B = { x: c, y: 0 };
  const C = { x: b * Math.cos(alphaRad), y: b * Math.sin(alphaRad) };

  return { A, B, C };
}
