import * as d3 from 'd3';
import { PreFrameUpdateType } from '@slippi/slippi-js';
import React, { useMemo, useRef } from 'react';
import Image from 'next/image';
import { ACTION_STATES } from '../util/actionStates';

interface Props {
  frame: PreFrameUpdateType | null;
}

const Z_MASK = 0b00000000_00010000;
const L_MASK = 0b00000000_00100000;
const R_MASK = 0b00000000_01000000;

const A_MASK = 0b00000001_00000000;
const B_MASK = 0b00000010_00000000;
const X_MASK = 0b00000100_00000000;
const Y_MASK = 0b00001000_00000000;

const joystickScale = d3.scaleLinear().domain([-1, 1]).range([-28, 32]);
const cstickScale = d3.scaleLinear().domain([-1, 1]).range([-22, 22]);
const triggerScale = d3.scaleLinear().domain([0, 1]).range([0, 100]);

const InputDisplay = ({ frame: initFrame }: Props) => {
  const frame = initFrame ?? {
    joystickX: 0,
    joystickY: 0,
    buttons: 0,
    physicalButtons: 0,
    cStickX: 0,
    cStickY: 0,
    physicalLTrigger: 0,
    physicalRTrigger: 0,
    actionStateId: -1,
  };

  const {
    joystickX,
    joystickY,
    buttons,
    physicalLTrigger,
    physicalRTrigger,
    cStickX,
    cStickY,
    actionStateId,
  } = frame;

  const lButton = (
    <div style={{ width: '116px', height: '24px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          padding: '7px 9px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            width:
              buttons & L_MASK ? '100%' : `${triggerScale(physicalLTrigger)}%`,
            height: '100%',
          }}
        />
      </div>
      <Image width="116px" height="24px" src="/controller/analog-outline.png" />
    </div>
  );

  const rButton = (
    <div style={{ width: '116px', height: '24px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          padding: '7px 9px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            width:
              buttons & R_MASK ? '100%' : `${triggerScale(physicalRTrigger)}%`,
            height: '100%',
          }}
        />
      </div>
      <Image width="116px" height="24px" src="/controller/analog-outline.png" />
    </div>
  );

  const joystick = (
    <div style={{ position: 'relative', width: '132px', height: '132px' }}>
      <Image
        width="132px"
        height="132px"
        src="/controller/joystick-gate-filled.png"
      />
      <div
        style={{
          width: '128px',
          height: '128px',
          position: 'absolute',
          top: joystickScale(joystickY),
          left: joystickScale(joystickX),
        }}
      >
        <Image
          width="128px"
          height="128px"
          src="/controller/joystick-filled.png"
        />
      </div>
    </div>
  );

  const cstick = (
    <div
      style={{
        position: 'relative',
        width: '128px',
        height: '128px',
      }}
    >
      <Image
        width="128px"
        height="128px"
        src="/controller/c-stick-gate-filled.png"
      />
      <div
        style={{
          width: '128px',
          height: '128px',
          position: 'absolute',
          top: cstickScale(cStickX),
          left: cstickScale(cStickY),
        }}
      >
        <Image
          width="128px"
          height="128px"
          src="/controller/c-stick-filled.png"
        />
      </div>
    </div>
  );

  const buttonToMask = {
    a: A_MASK,
    b: B_MASK,
    x: X_MASK,
    y: Y_MASK,
    z: Z_MASK,
  };

  const buttonEls = Object.fromEntries(
    Object.keys(buttonToMask).map(letter => [
      letter,
      <div>
        <div
          style={{
            visibility: buttonToMask[letter] & buttons ? 'visible' : 'hidden',
            position: 'absolute',
          }}
        >
          <Image
            width="128px"
            height="128px"
            src={`/controller/${letter}-pressed.png`}
          />
        </div>
        <div
          style={{
            visibility: buttonToMask[letter] & buttons ? 'hidden' : 'visible',
            position: 'absolute',
          }}
        >
          <Image
            width="128px"
            height="128px"
            src={`/controller/${letter}-filled.png`}
          />
        </div>
      </div>,
    ])
  );

  const action = ACTION_STATES[actionStateId];

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '500px',
          height: '200px',
          backgroundColor: 'black',
        }}
      >
        <div className="inputbutton" style={{ left: 25, top: 10 }}>
          {lButton}
        </div>
        <div className="inputbutton" style={{ left: 20, top: 50 }}>
          {joystick}
        </div>
        <div className="inputbutton" style={{ left: 185, top: 10 }}>
          {rButton}
        </div>
        <div className="inputbutton" style={{ left: 180, top: 50 }}>
          {cstick}
        </div>
        <div className="inputbutton" style={{ left: 330, top: 40 }}>
          {buttonEls.a}
          <div className="inputbutton" style={{ top: 50, left: -50 }}>
            {buttonEls.b}
          </div>
          <div className="inputbutton" style={{ top: -63, left: -13 }}>
            {buttonEls.y}
          </div>
          <div className="inputbutton" style={{ top: -19, left: 61 }}>
            {buttonEls.x}
          </div>
          <div className="inputbutton" style={{ top: -74, left: 50 }}>
            {buttonEls.z}
          </div>
        </div>
      </div>
      <div>
        <p>
          {actionStateId == -1 ? null : actionStateId}{' '}
          {action == null
            ? null
            : action.notes.length > 0
            ? action.notes
            : action.state}
        </p>
      </div>
    </div>
  );
};

export default InputDisplay;
