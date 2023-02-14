import { computeCurvature } from './computeCurvature';
import { Point } from './types';

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

  let pathSpecification = '';

  pathSpecification += `M ${points[1].x} ${points[1].y}`;
  pathSpecification += `
    C
      ${points[2].x} ${points[2].y},
      ${points[3].x} ${points[3].y},
      ${points[4].x} ${points[4].y}
  `;

  for (let i = 5; i < points.length - 3; i += 3) {
    pathSpecification += `
      C
        ${points[i].x} ${points[i].y},
        ${points[i + 1].x} ${points[i + 1].y},
        ${points[i + 2].x} ${points[i + 2].y}
    `;
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
      <path
        d={pathSpecification}
        stroke="red"
        strokeWidth={3}
        fill="transparent"
      />
      {renderCurvature ? curvatureCircles : null}
    </>
  );

}