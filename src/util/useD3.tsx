import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const useD3 = (fn: (container) => void, deps) => {
  const ref = useRef();

  useEffect(() => {
    fn(ref.current);
    return () => {};
  }, deps);
  return ref;
};
