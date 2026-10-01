export interface TriangleSides {
  a: number;
  b: number;
  c: number;
}

export function triangleSidesFromAngles(a: number, alpha: number, beta: number): TriangleSides {
  const gamma = 180 - alpha - beta;
  const radians = Math.PI / 180;
  const sineAlpha = Math.sin(alpha * radians);
  return {
    a,
    b: a * Math.sin(beta * radians) / sineAlpha,
    c: a * Math.sin(gamma * radians) / sineAlpha,
  };
}
