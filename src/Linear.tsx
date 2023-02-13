import { Point } from './types';

type LinearSplineProps = {
  points: Point[],
};

export function LinearSpline(props: LinearSplineProps) {

  const { points } = props;

  if (points.length < 4) {
    return null;
  }

  return (
    <polyline
      points={
        points.slice(1, -1).map(({ x, y }) => `${x} ${y}`).join(',')
      }
      stroke="white"
      strokeWidth={1}
      strokeDasharray={4}
      fill="transparent"
    />
  );

}