import { BezierCurveList } from './BezierCurveList';
import { computeCurvature } from './computeCurvature';
import { BezierCurve, Point } from './types';

type CardinalSplineProps = {
  points: Point[],
  scale: number,
  renderCurvature: boolean,
};

export function CardinalSpline(props: CardinalSplineProps) {

  const { points, scale, renderCurvature } = props;

  if (points.length < 4) {
    return null;
  }

  const bezierMatrix = (new DOMMatrix([
    1, -3, 3, -1,
    0, 3, -6, 3,
    0, 0, 3, -3,
    0, 0, 0, 1,
  ]));

  const cardinalMatrix = new DOMMatrix([
    0, -scale, 2 * scale, -scale,
    1, 0, scale - 3, 2 - scale,
    0, scale, 3 - 2 * scale, scale - 2,
    0, 0, -scale, scale
  ]);

  const cardinalSplineToBezier = bezierMatrix.inverse().multiply(cardinalMatrix);

  const bezierCurves: BezierCurve[] = [];

  const curvatureCircles = [];

  for (let i = 2; i < points.length - 1; i++) {

    const p0 = points[i - 2];
    const p1 = points[i - 1];
    const p2 = points[i];
    const p3 = points[i + 1];

    const bx = cardinalSplineToBezier.multiply(new DOMMatrix([
      p0.x, p1.x, p2.x, p3.x,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]));

    const by = cardinalSplineToBezier.multiply(new DOMMatrix([
      p0.y, p1.y, p2.y, p3.y,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]));

    const b0 = { x: bx.m11, y: by.m11 };
    const b1 = { x: bx.m12, y: by.m12 };
    const b2 = { x: bx.m13, y: by.m13 };
    const b3 = { x: bx.m14, y: by.m14 };

    bezierCurves.push([b0, b1, b2, b3]);

    // compute curvature (wip)

    if (renderCurvature) {

      const cx = cardinalMatrix.multiply(new DOMMatrix([
        p0.x, p1.x, p2.x, p3.x,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ]));

      const cy = cardinalMatrix.multiply(new DOMMatrix([
        p0.y, p1.y, p2.y, p3.y,
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
        resolution: 64,
        renderScale: 20,
        key: i
      }));

    }

  }

  return (
    <>
      <BezierCurveList
        curves={bezierCurves}
        pathProps={{
          stroke: 'lime',
          strokeWidth: 3,
          fill: 'transparent',
        }}
      />
      {renderCurvature && scale !== 0 ? curvatureCircles : null}
    </>
  );

}
