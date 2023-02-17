import React, { useState } from 'react';
import { OperationMode } from './types';
import { Bezier } from './Bezier';
import { BSpline } from './BSpline';
import { LinearSpline } from './Linear';
import { ExtendedPoints } from './ExtendedPoints';
import { BezierCurveList } from './BezierCurveList';
import { CardinalSpline } from './Cardinal';

type DraggablePoint = {
  x: number,
  y: number,
  grabbed: boolean,
};

function App() {
  const [points, setPoints] = useState<DraggablePoint[]>([
    { x: 100, y: 250, grabbed: false },
    { x: 200, y: 150, grabbed: false },
    { x: 300, y: 150, grabbed: false },
    { x: 400, y: 250, grabbed: false },
    { x: 500, y: 350, grabbed: false },
    { x: 600, y: 350, grabbed: false },
    { x: 700, y: 250, grabbed: false },
  ]);
  const [mode, setMode] = useState<OperationMode>('ADD_POINT');
  const [cardinalScale, setCardinalScale] = useState<number>(0.5);
  const [showCurvature, setShowCurvature] = useState<boolean>(false);
  const [showLinear, setShowLinear] = useState<boolean>(true);
  const [showBezier, setShowBezier] = useState<boolean>(true);
  const [showCardinal, setShowCardinal] = useState<boolean>(true);
  const [showBSpline, setShowBSpline] = useState<boolean>(true);
  function handleCanvasPointerDown(e: React.PointerEvent<SVGElement>) {
    if (mode !== 'ADD_POINT') {
      return;
    }
    setPoints([
      ...points,
      {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        grabbed: false,
      }
    ]);
  }
  function handlePointPointerDown(targetIndex: number, e: React.PointerEvent<SVGElement>) {
    e.stopPropagation();
    if (mode !== 'MOVE_POINT') {
      return;
    }
    setPoints(points.map((point, index) => {
      if (targetIndex !== index) {
        return point;
      }
      e.currentTarget.setPointerCapture(e.pointerId);
      return {
        x: point.x,
        y: point.y,
        grabbed: true,
      };
    }));
  }
  function handlePointPointerMove(targetIndex: number, e: React.PointerEvent<SVGElement>) {
    e.stopPropagation();
    if (mode !== 'MOVE_POINT') {
      return;
    }
    if (e.buttons !== 1) {
      return;
    };
    setPoints(points.map((point, index) => {
      if (targetIndex !== index) {
        return point;
      }
      if (!point.grabbed) {
        return point;
      }
      const x = Math.min(800, Math.max(0, e.nativeEvent.offsetX));
      const y = Math.min(500, Math.max(0, e.nativeEvent.offsetY));
      return {
        x, y,
        grabbed: true
      };
    }));
  }
  function handlePointPointerUp(targetIndex: number, e: React.PointerEvent<SVGElement>) {
    e.stopPropagation();
    if (mode !== 'MOVE_POINT') {
      return;
    }
    setPoints(points.map((point, index) => {
      if (targetIndex !== index) {
        return point;
      }
      e.currentTarget.setPointerCapture(e.pointerId);
      return {
        x: point.x,
        y: point.y,
        grabbed: false,
      };
    }));
  }

  const extendedPoints: typeof points = [];

  if (points.length >= 2) {
    extendedPoints.push({
      x: points[0].x * 2 - points[1].x,
      y: points[0].y * 2 - points[1].y,
      grabbed: false,
    });
  }

  for (const p of points) {
    extendedPoints.push(p);
  }

  if (points.length >= 2) {
    extendedPoints.push({
      x: points[points.length - 1].x * 2 - points[points.length - 2].x,
      y: points[points.length - 1].y * 2 - points[points.length - 2].y,
      grabbed: false,
    });
  }

  return (
    <div>
      <h1>Spline Curves</h1>
      <p>
        {mode === 'ADD_POINT' ? 'click canvas to add a control point' : ''}
        {mode === 'MOVE_POINT' ? 'drag a control point to manipulate line' : ''}
      </p>
      <div>
        <div>
          <div>
            <input type="checkbox" id="showCurvature" checked={showCurvature} onChange={(e) => setShowCurvature(e.target.checked)} />
            <label htmlFor="showCurvature">show curvature (wip)</label>
          </div>
          <div>
            <input type="checkbox" id="showLinear" checked={showLinear} onChange={(e) => setShowLinear(e.target.checked)} />
            <label htmlFor="showLinear">show linear</label>
          </div>
          <div>
            <input type="checkbox" id="showBezier" checked={showBezier} onChange={(e) => setShowBezier(e.target.checked)} />
            <label htmlFor="showBezier">show Bézier</label>
          </div>
          <div>
            <input type="checkbox" id="showCardinal" checked={showCardinal} onChange={(e) => setShowCardinal(e.target.checked)} />
            <label htmlFor="showCardinal">show cardinal</label>
            <input type="range" disabled={!showCardinal} min={0} max={1} step={0.05} value={cardinalScale} onChange={(e) => setCardinalScale(parseFloat(e.target.value))} />
            <span>{cardinalScale}</span>
            <span>{cardinalScale === 0.5 ? ' (at 0.5, it\'s equivalent to Catmull-Rom spline)' : null}</span>
            <span>{cardinalScale === 0 ? ' (at 0, it\'s equivalent to linear spline)' : null}</span>
          </div>
          <div>
            <input type="checkbox" id="showBSpline" checked={showBSpline} onChange={(e) => setShowBSpline(e.target.checked)} />
            <label htmlFor="showBSpline">show B-spline</label>
          </div>
        </div>
      </div>
      <p>
        <button onClick={() => setMode('ADD_POINT')}>add points</button>
        <button onClick={() => setMode('MOVE_POINT')}>move points</button>
        <button onClick={() => setPoints([])}>clear points</button>
        <button onClick={() => setPoints([
          { x: 100, y: 250, grabbed: false },
          { x: 200, y: 150, grabbed: false },
          { x: 300, y: 150, grabbed: false },
          { x: 400, y: 250, grabbed: false },
          { x: 500, y: 350, grabbed: false },
          { x: 600, y: 350, grabbed: false },
          { x: 700, y: 250, grabbed: false },
        ])}>reset</button>
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="800"
        height="500"
        style={{
          background: '#314761',
          cursor: {
            'ADD_POINT': 'crosshair',
            'MOVE_POINT': 'inherit'
          }[mode]
        }}
        onPointerDown={handleCanvasPointerDown}
      >
        {showBSpline ? <BSpline points={extendedPoints} renderCurvature={showCurvature} /> : null}
        {showLinear ? <LinearSpline points={extendedPoints} /> : null}
        {showBezier ? <Bezier points={extendedPoints} renderCurvature={showCurvature} /> : null}
        {showCardinal ? <CardinalSpline points={extendedPoints} scale={cardinalScale} renderCurvature={showCurvature} /> : null}
        {<ExtendedPoints points={extendedPoints} mode={mode} />}
        {points.map(({ x, y, grabbed }, i) => {
          return (
            <circle
              cx={x}
              cy={y}
              r={mode === 'MOVE_POINT' ? 10 : 1}
              key={i}
              fill={grabbed ? 'white' : '#314761'}
              stroke="white"
              strokeWidth={3}
              onPointerDown={(e) => handlePointPointerDown(i, e)}
              onPointerMove={(e) => handlePointPointerMove(i, e)}
              onPointerUp={(e) => handlePointPointerUp(i, e)}
              onPointerOut={(e) => handlePointPointerUp(i, e)}
              style={{
                cursor: {
                  'ADD_POINT': 'inherit',
                  'MOVE_POINT': 'grab'
                }[mode]
              }}
            />
          );
        })}
      </svg>
      <p>
        inspired by: <a href="https://www.youtube.com/watch?v=jvPPXbo87ds">"The Continuity of Splines"</a>, by Freya Holmér
      </p>
      <p>
        code: <a href="https://github.com/ikr7/curves">ikr7/curves</a> on GitHub
      </p>
    </div>
  );
}

export default App;
