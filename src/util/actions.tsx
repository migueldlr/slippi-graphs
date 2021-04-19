import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { Action } from './types';

const ACTION_STATES: Record<number, Action> = {};

function useActionStates() {
  const [ACTION_STATES, setActionStates] = useState<Record<number, Action>>({});
  useEffect(() => {
    (async () => {
      const data = await d3.csv('/action_states.csv');
      const parsed = Object.fromEntries(
        data.map(row => [
          +row['id_dec'],
          {
            id: +row['id_dec'],
            state: row['state'],
            notes: row['notes'],
          },
        ])
      );
      console.log(JSON.stringify(parsed));
      setActionStates(parsed);
    })();
  }, []);

  return ACTION_STATES;
}

export { useActionStates };
