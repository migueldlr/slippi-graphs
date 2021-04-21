import { useEffect, useMemo, useState } from 'react';

import Brush from '../components/Brush';
import Line from '../components/Line';
import Map from '../components/Map';
import { Data, FlatData } from '../util/types';
import InputDisplay from '../components/InputDisplay';
import PlayerInfo from '../components/PlayerInfo';
import {
  distanceBetween,
  filterData,
  frameCountToGameTime,
  getAPM,
  getPercents,
} from '../util/calc';
import GameInfo from '../components/GameInfo';

export default function Home() {
  const [origData, setOrigData] = useState<Data | null>(null);

  const [currentFrames, setCurrentFrames] = useState<[number, number]>(null);
  const canCalc = origData != null && currentFrames != null;
  const data = useMemo(
    () => (canCalc ? filterData(origData, currentFrames) : null),
    [origData, currentFrames]
  );

  const [frame, setFrame] = useState<number>();

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/game');
      const data: Data = await response.json();
      setOrigData(data);
      setCurrentFrames([0, data.stats.lastFrame]);
      console.log(data.stats);
      console.log(data.metadata);
      console.log(data.settings);
      console.log(data.frames[0]);
      console.log(data.inputs);
    })();
  }, []);

  const inputs: FlatData | null = useMemo(
    () => (canCalc ? getAPM(origData.inputs, currentFrames) : null),
    [origData, currentFrames]
  );
  const percents: FlatData | null = useMemo(
    () => (canCalc ? getPercents(origData.frames, currentFrames) : null),
    [origData, currentFrames]
  );
  const distances: FlatData | null = useMemo(
    () =>
      canCalc ? { 5: distanceBetween(origData.frames, currentFrames) } : null,
    [origData, currentFrames]
  );

  if (data == null) {
    return (
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
        }}
        className="container"
      >
        Loading frames...
      </div>
    );
  }

  const playerIds = Object.keys(data.metadata.players).map(id => +id);

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        paddingBottom: 20,
      }}
      className="container"
    >
      <div style={{ display: 'flex' }}>
        <div>
          <InputDisplay
            frame={
              frame == null
                ? null
                : frame in data.frames
                ? data.frames[frame].players[playerIds[0]].pre
                : null
            }
          />
          <PlayerInfo
            setFrame={setFrame}
            frames={data.frames}
            metadata={data.metadata}
            playerIndex={playerIds[0]}
            opponentIndex={playerIds[1]}
            stats={data.stats}
          />
        </div>
        <div>
          <GameInfo settings={data.settings} />
          <Map
            data={origData}
            currentFrames={currentFrames}
            frame={frame}
            setFrame={setFrame}
          />
        </div>
        <div>
          <InputDisplay
            frame={
              frame == null
                ? null
                : frame in data.frames
                ? data.frames[frame].players[playerIds[1]].pre
                : null
            }
          />
          <PlayerInfo
            setFrame={setFrame}
            frames={data.frames}
            metadata={data.metadata}
            playerIndex={playerIds[1]}
            opponentIndex={playerIds[0]}
            stats={data.stats}
          />
        </div>
      </div>
      {/* <p>
        {frame ?? 'no frame'} -{' '}
        {frame != null ? frameCountToGameTime(frame) : 0} -{' '}
        {JSON.stringify(currentFrames)} -{' '}
        {`[${frameCountToGameTime(currentFrames[0])}, ${frameCountToGameTime(
          currentFrames[1]
        )}]`}
      </p> */}
      <div
        style={{
          width: `80%`,
        }}
      >
        <div style={{ position: 'relative' }}>
          <Brush
            min={0}
            max={data.stats.lastFrame}
            setValue={e => setCurrentFrames(e)}
            value={currentFrames}
            marks={data.stats.stocks.map(stock => {
              return [stock.endFrame, `Player ${stock.playerIndex} dies`];
            })}
            bands={data.stats.conversions.map(conversion => {
              return [
                [conversion.startFrame, conversion.endFrame],
                conversion.playerIndex,
              ];
            })}
            frame={frame}
          />
        </div>
        <Line data={percents} frame={frame} setFrame={setFrame} />
        <Line data={inputs} frame={frame} setFrame={setFrame} />
        <Line data={distances} frame={frame} setFrame={setFrame} />
      </div>
    </div>
  );
}

export const ususedExport = 'this turns off fast refresh';
