import type { SolveResult, TriangleSolution } from './triangle';

/** Returns every valid solution that should be shown in the diagram. */
export function getDiagramSolutions(result: SolveResult | null): TriangleSolution[] {
  if (!result) return [];
  if (result.status.kind === 'solved') return [result.status.solution];
  if (result.status.kind === 'multiple') return result.status.solutions;
  return [];
}
