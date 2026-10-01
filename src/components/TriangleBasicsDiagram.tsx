import type { TriangleSides } from '@/lib/triangleBasicsGeometry';

interface TriangleBasicsDiagramProps {
  sides: TriangleSides;
  label: string;
}

export function TriangleBasicsDiagram({ sides, label }: TriangleBasicsDiagramProps) {
  const { a, b, c } = sides;
  const safeBase = Math.max(c, Number.EPSILON);
  const rawX = (b * b + c * c - a * a) / (2 * safeBase);
  const rawHeight = Math.sqrt(Math.max(0, b * b - rawX * rawX));
  const width = 320;
  const height = 220;
  const padding = 48;
  const scale = Math.min((width - padding * 2) / safeBase, (height - padding * 2) / Math.max(rawHeight, Number.EPSILON));
  const drawnWidth = c * scale;
  const drawnHeight = rawHeight * scale;
  const left = (width - drawnWidth) / 2;
  const top = (height - drawnHeight) / 2;
  const A = { x: left, y: top + drawnHeight };
  const B = { x: left + drawnWidth, y: top + drawnHeight };
  const C = { x: left + rawX * scale, y: top };
  const center = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };

  const outwardLabel = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const middle = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const dx = middle.x - center.x;
    const dy = middle.y - center.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: middle.x + dx / length * 15, y: middle.y + dy / length * 15 };
  };
  const inwardLabel = (point: { x: number; y: number }) => {
    const dx = center.x - point.x;
    const dy = center.y - point.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: point.x + dx / length * 22, y: point.y + dy / length * 22 };
  };

  const sideA = outwardLabel(B, C);
  const sideB = outwardLabel(A, C);
  const sideC = outwardLabel(A, B);
  const alpha = inwardLabel(A);
  const beta = inwardLabel(B);
  const gamma = inwardLabel(C);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={label}>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#eff6ff" stroke="#2563eb" strokeWidth="3" strokeLinejoin="round" />
      <text x={sideA.x} y={sideA.y} textAnchor="middle" className="fill-slate-800 text-sm font-semibold">a</text>
      <text x={sideB.x} y={sideB.y} textAnchor="middle" className="fill-slate-800 text-sm font-semibold">b</text>
      <text x={sideC.x} y={sideC.y} textAnchor="middle" className="fill-slate-800 text-sm font-semibold">c</text>
      <text x={alpha.x} y={alpha.y} textAnchor="middle" className="fill-blue-800 text-sm font-semibold">α</text>
      <text x={beta.x} y={beta.y} textAnchor="middle" className="fill-blue-800 text-sm font-semibold">β</text>
      <text x={gamma.x} y={gamma.y} textAnchor="middle" className="fill-blue-800 text-sm font-semibold">γ</text>
    </svg>
  );
}
