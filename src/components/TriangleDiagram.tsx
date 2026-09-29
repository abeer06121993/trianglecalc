import { useMemo } from 'react';
import { getTriangleVertices, type TriangleSolution, type Unit } from '@/lib/triangle';
import { formatAngle, formatLength } from '@/lib/triangle';

export type HighlightKey = 'a' | 'b' | 'c' | 'alpha' | 'beta' | 'gamma' | null;

interface Props {
  solution: TriangleSolution | null;
  unit: Unit;
  hasValues: boolean;
  highlight: HighlightKey;
  knownKeys: Set<string>;
}

function sideLabelPos(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  centroid: { x: number; y: number },
  offset: number,
): { x: number; y: number } {
  const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  const dx = mid.x - centroid.x;
  const dy = mid.y - centroid.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: mid.x + (dx / len) * offset,
    y: mid.y + (dy / len) * offset,
  };
}

function vertexLabelPos(
  v: { x: number; y: number },
  centroid: { x: number; y: number },
  offset: number,
): { x: number; y: number } {
  const dx = v.x - centroid.x;
  const dy = v.y - centroid.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: v.x + (dx / len) * offset,
    y: v.y + (dy / len) * offset,
  };
}

export default function TriangleDiagram({ solution, unit, hasValues, highlight, knownKeys }: Props) {
  const computed = useMemo(() => {
    if (!solution) return null;

    const verts = getTriangleVertices(solution);
    const { A, B, C } = verts;

    const points = {
      A: { x: A.x, y: -A.y },
      B: { x: B.x, y: -B.y },
      C: { x: C.x, y: -C.y },
    };

    const centroid = {
      x: (points.A.x + points.B.x + points.C.x) / 3,
      y: (points.A.y + points.B.y + points.C.y) / 3,
    };

    const allX = [points.A.x, points.B.x, points.C.x];
    const allY = [points.A.y, points.B.y, points.C.y];
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const w = maxX - minX;
    const h = maxY - minY;

    return { points, centroid, minX, maxX, minY, maxY, w, h };
  }, [solution]);

  if (!solution || !computed) {
    return (
      <div className="flex items-center justify-center w-full bg-slate-50/50 rounded-xl border border-dashed border-slate-200" style={{ minHeight: '280px' }}>
        <div className="text-center px-6 py-10">
          <svg width="140" height="120" viewBox="0 0 140 120" className="mx-auto" aria-hidden="true">
            <polygon
              points="70,15 125,105 15,105"
              fill="rgba(148,163,184,0.06)"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <text x="70" y="55" textAnchor="middle" fontSize="12" fontWeight="600" fill="#94a3b8">α</text>
            <text x="108" y="98" textAnchor="middle" fontSize="12" fontWeight="600" fill="#94a3b8">β</text>
            <text x="32" y="98" textAnchor="middle" fontSize="12" fontWeight="600" fill="#94a3b8">γ</text>
          </svg>
          <p className="mt-2 text-sm text-slate-400">
            {hasValues ? 'Enter one more value to see the triangle' : 'Enter the values you know. We\u2019ll calculate the rest.'}
          </p>
        </div>
      </div>
    );
  }

  const { points, centroid, minX, maxX, minY, maxY, w, h } = computed;

  // Keep the SVG in a fixed coordinate system so labels do not scale with
  // the triangle's real-world dimensions. This prevents tiny triangles such
  // as a 3-4-5 triangle from producing oversized text and overlapping labels.
  const svgW = 600;
  const svgH = 420;
  const pad = 70;
  const drawableW = svgW - pad * 2;
  const drawableH = svgH - pad * 2;
  const scale = Math.min(drawableW / Math.max(w, 1e-9), drawableH / Math.max(h, 1e-9));
  const offsetX = (svgW - w * scale) / 2 - minX * scale;
  const offsetY = (svgH - h * scale) / 2 - minY * scale;

  const T = (p: { x: number; y: number }) => ({
    x: p.x * scale + offsetX,
    y: p.y * scale + offsetY,
  });

  const A = T(points.A);
  const B = T(points.B);
  const C = T(points.C);
  const cg = T(centroid);

  const labelOffset = 30;
  const sideALabel = sideLabelPos(B, C, cg, labelOffset);
  const sideBLabel = sideLabelPos(A, C, cg, labelOffset);
  const sideCLabel = sideLabelPos(A, B, cg, labelOffset);

  const vOffset = 40;
  const alphaLabel = vertexLabelPos(A, cg, vOffset);
  const betaLabel = vertexLabelPos(B, cg, vOffset);
  const gammaLabel = vertexLabelPos(C, cg, vOffset);

  const angleArc = (vertex: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }, radius: number) => {
    const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
    const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
    let start = a1;
    let delta = a2 - start;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    const sx = vertex.x + radius * Math.cos(start);
    const sy = vertex.y + radius * Math.sin(start);
    const ex = vertex.x + radius * Math.cos(start + delta);
    const ey = vertex.y + radius * Math.sin(start + delta);
    const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
    const sweep = delta > 0 ? 1 : 0;

    return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${ex} ${ey}`;
  };

  const arcRadius = Math.min(30, Math.max(18, Math.min(w * scale, h * scale) * 0.13));

  // Highlight colors
  const hlColor = '#2563eb';
  const defaultStroke = '#3b82f6';
  const defaultArcStroke = '#94a3b8';
  const sideStroke = (key: 'a' | 'b' | 'c') => highlight === key ? hlColor : defaultStroke;
  const sideStrokeWidth = (key: 'a' | 'b' | 'c') => highlight === key ? 4 : 2.5;
  const arcStroke = (key: 'alpha' | 'beta' | 'gamma') => highlight === key ? hlColor : defaultArcStroke;
  const arcWidth = (key: 'alpha' | 'beta' | 'gamma') => highlight === key ? 3 : 1.5;
  const arcOpacity = (key: 'alpha' | 'beta' | 'gamma') => highlight === key ? 0.8 : 0.45;
  const labelFill = (key: string) => highlight === key ? '#1e40af' : knownKeys.has(key) ? '#1e293b' : '#64748b';
  const labelFontWeight = (key: string) => highlight === key ? 700 : 600;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full h-auto"
        style={{ transition: 'all 0.3s ease' }}
        role="img"
        aria-label={`Triangle with sides a = ${solution.a.toFixed(2)} ${unit}, b = ${solution.b.toFixed(2)} ${unit}, c = ${solution.c.toFixed(2)} ${unit} and angles α = ${solution.alpha.toFixed(2)}°, β = ${solution.beta.toFixed(2)}°, γ = ${solution.gamma.toFixed(2)}°`}
      >
        {/* Triangle fill */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="rgba(59, 130, 246, 0.06)"
          stroke="none"
        />

        {/* Side a = BC */}
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y}
          stroke={sideStroke('a')} strokeWidth={sideStrokeWidth('a')} strokeLinecap="round"
          style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }} />

        {/* Side b = AC */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y}
          stroke={sideStroke('b')} strokeWidth={sideStrokeWidth('b')} strokeLinecap="round"
          style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }} />

        {/* Side c = AB */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
          stroke={sideStroke('c')} strokeWidth={sideStrokeWidth('c')} strokeLinecap="round"
          style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }} />

        {/* Right angle marker */}
        {(() => {
          const isRight = (angle: number) => Math.abs(angle - 90) < 0.1;
          if (isRight(solution.alpha)) return <RightAngleMarker vertex={A} p1={B} p2={C} />;
          if (isRight(solution.beta)) return <RightAngleMarker vertex={B} p1={A} p2={C} />;
          if (isRight(solution.gamma)) return <RightAngleMarker vertex={C} p1={A} p2={B} />;
          return null;
        })()}

        {/* Angle arcs */}
        <path d={angleArc(A, B, C, arcRadius)} fill="none"
          stroke={arcStroke('alpha')} strokeWidth={arcWidth('alpha')} opacity={arcOpacity('alpha')}
          style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease, opacity 0.2s ease' }} />
        <path d={angleArc(B, C, A, arcRadius)} fill="none"
          stroke={arcStroke('beta')} strokeWidth={arcWidth('beta')} opacity={arcOpacity('beta')}
          style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease, opacity 0.2s ease' }} />
        <path d={angleArc(C, A, B, arcRadius)} fill="none"
          stroke={arcStroke('gamma')} strokeWidth={arcWidth('gamma')} opacity={arcOpacity('gamma')}
          style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease, opacity 0.2s ease' }} />

        {/* Side labels */}
        <SideLabelText pos={sideALabel} label="a" value={solution.a} unit={unit}
          fill={labelFill('a')} fontWeight={labelFontWeight('a')} known={knownKeys.has('a')} />
        <SideLabelText pos={sideBLabel} label="b" value={solution.b} unit={unit}
          fill={labelFill('b')} fontWeight={labelFontWeight('b')} known={knownKeys.has('b')} />
        <SideLabelText pos={sideCLabel} label="c" value={solution.c} unit={unit}
          fill={labelFill('c')} fontWeight={labelFontWeight('c')} known={knownKeys.has('c')} />

        {/* Angle labels */}
        <AngleLabelText pos={alphaLabel} label="α" value={solution.alpha}
          fill={labelFill('alpha')} fontWeight={labelFontWeight('alpha')} known={knownKeys.has('alpha')} />
        <AngleLabelText pos={betaLabel} label="β" value={solution.beta}
          fill={labelFill('beta')} fontWeight={labelFontWeight('beta')} known={knownKeys.has('beta')} />
        <AngleLabelText pos={gammaLabel} label="γ" value={solution.gamma}
          fill={labelFill('gamma')} fontWeight={labelFontWeight('gamma')} known={knownKeys.has('gamma')} />
      </svg>
    </div>
  );
}

function RightAngleMarker({
  vertex,
  p1,
  p2,
}: {
  vertex: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
}) {
  const size = 18;
  const v1x = p1.x - vertex.x;
  const v1y = p1.y - vertex.y;
  const v2x = p2.x - vertex.x;
  const v2y = p2.y - vertex.y;
  const l1 = Math.sqrt(v1x * v1x + v1y * v1y) || 1;
  const l2 = Math.sqrt(v2x * v2x + v2y * v2y) || 1;

  const u1 = { x: v1x / l1, y: v1y / l1 };
  const u2 = { x: v2x / l2, y: v2y / l2 };

  const corner = { x: vertex.x + u1.x * size + u2.x * size, y: vertex.y + u1.y * size + u2.y * size };
  const a = { x: vertex.x + u1.x * size, y: vertex.y + u1.y * size };
  const b = { x: vertex.x + u2.x * size, y: vertex.y + u2.y * size };

  return <polyline points={`${a.x},${a.y} ${corner.x},${corner.y} ${b.x},${b.y}`} fill="none" stroke="#64748b" strokeWidth="1.5" opacity="0.6" />;
}

function SideLabelText({
  pos, label, value, unit, fill, fontWeight, known,
}: {
  pos: { x: number; y: number };
  label: string;
  value: number;
  unit: Unit;
  fill: string;
  fontWeight: number;
  known: boolean;
}) {
  return (
    <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
      style={{ transition: 'fill 0.2s ease' }}>
      <tspan x={pos.x} dy="-0.5em" fontSize="13" fontWeight={fontWeight} fill={fill}>
        {label}
      </tspan>
      <tspan x={pos.x} dy="1.3em" fontSize="11" fontWeight={500} fill={known ? fill : '#94a3b8'}>
        {known ? formatLength(value, unit) : '?'}
      </tspan>
    </text>
  );
}

function AngleLabelText({
  pos, label, value, fill, fontWeight, known,
}: {
  pos: { x: number; y: number };
  label: string;
  value: number;
  fill: string;
  fontWeight: number;
  known: boolean;
}) {
  return (
    <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
      style={{ transition: 'fill 0.2s ease' }}>
      <tspan x={pos.x} dy="-0.5em" fontSize="13" fontWeight={fontWeight} fill={fill}>
        {label}
      </tspan>
      <tspan x={pos.x} dy="1.3em" fontSize="11" fontWeight={500} fill={known ? fill : '#94a3b8'}>
        {known ? formatAngle(value) : '?'}
      </tspan>
    </text>
  );
}
