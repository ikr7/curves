import { Point } from './types';

type BSplineProps = {
  extendedPoints: Point[],
};

export function BSpline(props: BSplineProps) {

  const { extendedPoints } = props;

  if (extendedPoints.length < 4) {
    return null;
  }

  const bSplineToBezier = (new DOMMatrix([
    1, -3, 3, -1,
    0, 3, -6, 3,
    0, 0, 3, -3,
    0, 0, 0, 1,
  ])).inverse().multiply(new DOMMatrix([
    1, -3, 3, -1,
    4, 0, -6, 3,
    1, 3, 3, -3,
    0, 0, 0, 1,
  ].map(e => e / 6)));

  const bezierCurves: [Point, Point, Point, Point][] = [];

  for (let i = 2; i < extendedPoints.length - 1; i++) {

    const p0 = extendedPoints[i - 2];
    const p1 = extendedPoints[i - 1];
    const p2 = extendedPoints[i];
    const p3 = extendedPoints[i + 1];

    const bx = bSplineToBezier.multiply(new DOMMatrix([
      p0.x, p1.x, p2.x, p3.x,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]));

    const by = bSplineToBezier.multiply(new DOMMatrix([
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

  }

  let pathSpecification = '';

  pathSpecification += `M ${bezierCurves[0][0].x} ${bezierCurves[0][0].y}`;
  pathSpecification += `
        C
          ${bezierCurves[0][1].x} ${bezierCurves[0][1].y},
          ${bezierCurves[0][2].x} ${bezierCurves[0][2].y},
          ${bezierCurves[0][3].x} ${bezierCurves[0][3].y}
      `;

  for (const [b0, b1, b2, b3] of bezierCurves.slice(1)) {
    pathSpecification += ` S ${b2.x} ${b2.y}, ${b3.x} ${b3.y}`;
  }

  return (<path
    d={pathSpecification}
    stroke="yellow"
    strokeWidth={3}
    fill="transparent"
  />);

}
