export type Point = {
    x: number,
    y: number,
};

export type BezierCurve = [Point, Point, Point, Point];

export type OperationMode = 'ADD_POINT' | 'MOVE_POINT';
