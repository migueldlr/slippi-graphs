import React from 'react';

const Spinner = () => {
  return (
    <p
      style={{
        animationName: 'spin',
        animationDuration: '1000ms',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      }}
    >
      🐸
    </p>
  );
};

export default Spinner;
