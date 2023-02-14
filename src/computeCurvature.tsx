import { Point } from './types';

type CurvatureProps = {
  cubicCurveCoefficients: [Point, Point, Point, Point],
  resolution: number,
  renderScale: number,
  key: number,
};

export function computeCurvature(props: CurvatureProps) {

  const { cubicCurveCoefficients, resolution, key, renderScale } = props;

  const curvaturePoints = [];

  const [c0, c1, c2, c3] = cubicCurveCoefficients;

  for (let t = 0; t < 1; t += 1 / resolution) {
    const t2 = t * t;
    const t3 = t2 * t;
    const xd = c1.x + 2 * c2.x * t + 3 * c3.x * t2; // 1st derivative
    const xdd = 2 * c2.x + 6 * c3.x * t; // 2nd derivative
    const yd = c1.y + 2 * c2.y * t + 3 * c3.y * t2;
    const ydd = 2 * c2.y + 6 * c3.y * t;
    const r = (xd * xd + yd * yd) / (xd * ydd - yd * xdd);
    const x = c0.x + c1.x * t + c2.x * t2 + c3.x * t3;
    const y = c0.y + c1.y * t + c2.y * t2 + c3.y * t3;
    const velocityNorm = Math.hypot(xd, yd);
    const factor = renderScale / r / velocityNorm;
    curvaturePoints.push(<line
      x1={x}
      y1={y}
      x2={x + yd * factor}
      y2={y - xd * factor}
      stroke="black"
      key={`${key}-${t}`}
    />)
  }

  return curvaturePoints;

}