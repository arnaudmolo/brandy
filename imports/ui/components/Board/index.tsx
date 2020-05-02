import React, { useMemo, useCallback } from 'react';
import MouseBackEnd from 'react-dnd-mouse-backend';
import { useDrag, DndProvider, useDrop } from 'react-dnd';
import { findIndex } from 'ramda';
import { withResizeDetector } from 'react-resize-detector';
import { useSpring, animated } from 'react-spring';

import Player from '../../models/Player';
import data from './points';
import './styles.css';

const POINT = 'POINT';

const Point: React.SFC<{
  id: string;
  position: any;
  cx: number;
  cy: number;
  xRatio: number;
  yRatio: number;
  movable: boolean;
}> = React.memo((props) => {
  const { id } = props;
  const [collectedProps, drag] = useDrag({
    item: { id, type: POINT, payload: props.position },
    collect: monitor => {
      if (!monitor.isDragging()) {
        return
      }
      const position = monitor.getDifferenceFromInitialOffset();
      return position && {
        x: position.x * props.xRatio,
        y: position.y * props.yRatio,
      };
    },
  });
  const x = collectedProps ? (collectedProps.x + props.cx) : props.cx;
  const y = collectedProps ? (collectedProps.y + props.cy) : props.cy;
  const animate = useSpring({
    xy: [x, y]
  });
  return (
    <animated.g
      className={`point__container point__container__${props.position.color}  ${collectedProps ? 'point__container-invisible' : ''}`}
      transform={animate.xy.interpolate((x: number, y: number) => `translate(${x}, ${y}) ${collectedProps ? 'scale(1.5)' : ''}`)}
      ref={drag}
    >
      <circle
        className={`point point__${props.position.color}`}
        r={14.12}
        cx={0}
        cy={0}
      />
      <circle
        className={`point__shape`}
        r={14.12}
        cx={0}
        cy={0}
      />
      <text>{props.position.position}</text>
    </animated.g>
  );
});

const Drop: React.SFC<{
  polygon: any;
  onDrop?: (pointDescription, target: number) => any;
  onClick: (...args: any[]) => any;
  enable: boolean;
  id: number;
}> = React.memo(({enable, polygon, onDrop, onClick}) => {

  const [, drop] = useDrop({
    accept: POINT,
    drop: useCallback((pointDescription) => {
      onDrop && pointDescription.payload.position !== polygon.position && onDrop(pointDescription, polygon.position);
    }, [onDrop, polygon.position, enable])
  });
  return (
    <g onClick={onClick} className={`polygon-container ${enable ? 'polygon-container__enabled' : 'polygon-container__disabled' }`} transform={`translate(${polygon.cx}, ${polygon.cy})`}>
      <circle
        className={`slot slot__${polygon.color}`}
        cx={0}
        cy={0}
        r="13.12"
      />
      <circle
        ref={drop}
        className={`slot-hover`}
        cx={0}
        cy={0}
        r="20"
      />
      <text>{polygon.position}</text>
    </g>
  );
});

const margins = {
  left: 10,
  top: 10,
  right: 10,
  bottom: 10,
};

type Pawn = {
  position: number,
  color: string
};

type Props = {
  players?: Player[];
  pawns: Pawn[];
  playable: {
    from: Pawn;
    to: {
      cx: number,
      cy: number,
      color?: string,
      position: number
    }[];
  }[];
  setPawns: (fromIndexOf: number, to: number) => any;
};

const XVB = 980;
const YVB = 980;

const Board: React.SFC<Props> = React.memo(withResizeDetector<Props>((props) => {
  const { pawns, setPawns, playable } = props;
  let { width, height } = props;
  width = width || 100;
  height = height || 100;
  width = Math.min(width, 750);
  height = Math.min(height, 750);
  const w = width+ margins.left + margins.right;
  const h = height + margins.top + margins.bottom;
  const xRatio = XVB / width;
  const yRatio = YVB / height;

  const onDrop = useCallback((pointDescription, newPosition) => {
    setPawns(
      findIndex(
        (p: Pawn) => pointDescription.payload.position === p.position && pointDescription.payload.color === p.color,
        pawns
      ),
      newPosition,
    );
  }, [pawns, setPawns]);

  const drops = playable.reduce((acc, move) => {
    return move.to.reduce((acc, drop) => acc.add(drop), acc);
  }, new Set());

  return (
    <svg
      className="board--scene"
      version="1.1"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox={`0 0 ${yRatio * h} ${xRatio * w}`}
    >
      <defs>
        <radialGradient
          id={`creux`}
          cx={0}
          cy={0}
          r="13.14"
          gradientUnits="userSpaceOnUse"
          fx={5}
          fy={5}
        >
          <stop
            offset="0"
            stopColor='transparent'
          />
          <stop
            offset="1"
            stopColor='rgba(0, 0, 0, 0.2)'
          />
        </radialGradient>
        <radialGradient
          id={`boule`}
          cx={0}
          cy={0}
          r="13.14"
          gradientUnits="userSpaceOnUse"
          fx={-5}
          fy={-5}
        >
          <stop
            offset="0"
            stopColor='rgba(255, 255, 255, 0.4)'
          />
          <stop
            offset="1"
            stopColor='rgba(0, 0, 0, 0.2)'
          />
        </radialGradient>
      </defs>
      <g>
        <g>
          {useMemo(() =>
            data.map((polygon, index) => {
              return (
                <Drop
                  enable={drops.has(polygon)}
                  // enable
                  onClick={() => console.log(index, polygon, drops.has(polygon))}
                  onDrop={onDrop}
                  key={index}
                  id={index}
                  polygon={polygon}
                />
              )
            })
          , [onDrop])}
        </g>
        <g className="points">
          {useMemo(() =>
            pawns.map((pawn, i) => {
              const position = data[pawn.position];
              // const ok = playable.find(move => move.to)
              return (
                <Point
                  key={`${pawn.color}-${i}`}
                  cx={position.cx}
                  cy={position.cy}
                  position={pawn}
                  xRatio={xRatio}
                  yRatio={yRatio}
                />
              );
            })
          , [pawns, xRatio, yRatio])}
        </g>
      </g>
    </svg>
  );
}));

export default React.memo((props: Props) => <DndProvider backend={MouseBackEnd}><Board {...props} /></DndProvider>);
