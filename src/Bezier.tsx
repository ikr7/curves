import { Point } from './types';

type BezierProps = {
  points: Point[],
};

export function Bezier(props: BezierProps) {

  const { points } = props;

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

  return (<path
    d={pathSpecification}
    stroke="red"
    strokeWidth={3}
    fill="transparent"
  />);

}