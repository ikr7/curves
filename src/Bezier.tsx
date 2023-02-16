import { BezierCurveList } from './BezierCurveList';
import { computeCurvature } from './computeCurvature';
import { BezierCurve, Point } from './types';

type BezierProps = {
  points: Point[],
  renderCurvature: boolean,
};

const bezierMatrix = (new DOMMatrix([
  1, -3, 3, -1,
  0, 3, -6, 3,
  0, 0, 3, -3,
  0, 0, 0, 1,
]));

export function Bezier(props: BezierProps) {

  const { points, renderCurvature } = props;

  if (points.length < 6) {
    return null;
  }

  const curves: BezierCurve[] = [];

  for (let i = 1; i < points.length - 4; i += 3) {
    curves.push([
      { x: points[i].x, y: points[i].y },
      { x: points[i + 1].x, y: points[i + 1].y },
      { x: points[i + 2].x, y: points[i + 2].y },
      { x: points[i + 3].x, y: points[i + 3].y },
    ]);
  }

  // compute curvature (wip)

  const curvatureCircles = [];

  if (renderCurvature) {

    for (let i = 1; i < points.length - 3; i += 3) {
      const cx = bezierMatrix.multiply(new DOMMatrix([
        points[i].x, points[i + 1].x, points[i + 2].x, points[i + 3].x,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ]));
      const cy = bezierMatrix.multiply(new DOMMatrix([
        points[i].y, points[i + 1].y, points[i + 2].y, points[i + 3].y,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ]));
      const c0 = { x: cx.m11, y: cy.m11 };
      const c1 = { x: cx.m12, y: cy.m12 };
      const c2 = { x: cx.m13, y: cy.m13 };
      const c3 = { x: cx.m14, y: cy.m14 };
      curvatureCircles.push(...computeCurvature({
        cubicCurveCoefficients: [c0, c1, c2, c3],
        resolution: 256,
        renderScale: 10,
        key: i
      }));
    }

  }

  return (
    <>
      <BezierCurveList
        curves={curves}
        pathProps={{
          stroke: 'red',
          strokeWidth: 3,
          fill: 'transparent',
        }}
      />
      {renderCurvature ? curvatureCircles : null}
    </>
  );

}