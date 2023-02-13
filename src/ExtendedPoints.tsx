import { Point, OperationMode } from './types';

type ExtendedPointsProps = {
  points: Point[],
  mode: OperationMode,
};

export function ExtendedPoints(props: ExtendedPointsProps) {

  const { points, mode } = props;

  if (points.length < 4) {
    return null;
  }

  return (
    <>
      <circle
        cx={points[0].x}
        cy={points[0].y}
        r={mode === 'MOVE_POINT' ? 10 : 3}
        fill="#314761"
        stroke="gray"
        strokeWidth={3}
        key="extendedStartPoint"
      />
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={mode === 'MOVE_POINT' ? 10 : 3}
        fill="#314761"
        stroke="gray"
        strokeWidth={3}
        key="extendedEndPoint"
      />
    </>
  );

}