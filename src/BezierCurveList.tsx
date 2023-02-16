import React from 'react';
import { BezierCurve } from './types';

type Props = {
  curves: BezierCurve[],
  pathProps: Omit<React.SVGAttributes<SVGPathElement>, 'd'>,
}

export function BezierCurveList(props: Props) {
  const { curves, pathProps } = props;
  if (curves.length < 1) {
    return null;
  }
  let pathSpecification = '';
  pathSpecification +=
    `M${curves[0][0].x} ${curves[0][0].y}` +
    `C${curves[0][1].x} ${curves[0][1].y}` +
    `,${curves[0][2].x} ${curves[0][2].y}` +
    `,${curves[0][3].x} ${curves[0][3].y}`;
  for (const [c0, c1, c2, c3] of curves.slice(1)) {
    pathSpecification +=
      `C${c1.x} ${c1.y}` +
      `,${c2.x} ${c2.y}` +
      `,${c3.x} ${c3.y}`;
  }
  return (
    <path
      d={pathSpecification}
      {...pathProps}
    />
  );
}
