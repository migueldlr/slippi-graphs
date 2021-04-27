import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

import Brush from '../components/Brush';
import Line from '../components/Line';
import Map from '../components/Map';
import { Data, FlatData, LoadState } from '../util/types';
import InputDisplay from '../components/InputDisplay';
import PlayerStats from '../components/PlayerStats';
import {
  distanceBetween,
  filterData,
  frameCountToGameTime,
  getAPM,
  getPercents,
} from '../util/calc';
import GameInfo from '../components/GameInfo';
import PlayerInfo from '../components/PlayerInfo';
import { useDropzone } from 'react-dropzone';
import { fetch_retry } from '../util/util';

export default function Home() {
  const [loadState, setLoadState] = useState<LoadState>(LoadState.IDLE);
  const [origData, setOrigData] = useState<Data | null>(null);

  const [currentFrames, setCurrentFrames] = useState<[number, number]>(null);
  const canCalc = origData != null && currentFrames != null;
  const data = useMemo(
    () => (canCalc ? filterData(origData, currentFrames) : null),
    [origData, currentFrames]
  );

  const [frame, setFrame] = useState<number>();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(process.env.NODE_ENV);
      (async () => {
        setLoadState(LoadState.LOADING);
        const response = await fetch('/api/game');
        const data: Data = await response.json();
        // console.log(JSON.stringify(data.frames).length);
        for (let key in data) {
          console.log(`${key}: ${JSON.stringify(data[key]).length}`);
        }
        setOrigData(data);
        setCurrentFrames([0, data.stats.lastFrame]);
        console.log(data.stats);
        console.log(data.metadata);
        console.log(data.settings);
        console.log(data.frames[0]);
        console.log(data.inputs);
        setLoadState(LoadState.SUCCESS);
      })();
    }
  }, []);

  // useEffect(() => {

  // }, []);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // const formData = new FormData();

    // formData.append('file', acceptedFiles[0]);

    (async () => {
      setLoadState(LoadState.LOADING);
      let urlRes;
      try {
        urlRes = await fetch(process.env.NEXT_PUBLIC_AWS_LAMBDA_URL);
      } catch (e) {
        setLoadState(LoadState.ERROR);
        return;
      }

      const { uploadURL } = await urlRes.json();
      await fetch(uploadURL, {
        method: 'PUT',
        body: acceptedFiles[0],
        headers: {
          'Content-Type': '.slp',
        },
      });

      const url = uploadURL
        .split('?')[0]
        .replace('.slp', '.json')
        .replace('melee-vis-data', 'melee-vis-data-parsed');

      try {
        const res2 = await fetch_retry(5, url);
        const data: Data = await res2.json();
        setOrigData(data);
        setCurrentFrames([0, data.stats.lastFrame]);
        setLoadState(LoadState.SUCCESS);
      } catch (e) {
        setLoadState(LoadState.ERROR);
      }
    })();
  }, []);

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
    accept: '.slp',
    maxFiles: 1,
  });

  const head = (
    <Head>
      <title>Melee Visualization</title>
    </Head>
  );

  if (loadState === LoadState.IDLE) {
    return (
      <div className="container">
        {head}
        <div
          {...getRootProps({ className: 'dropzone' })}
          style={{ backgroundColor: '#EBEBEB', padding: '20px' }}
        >
          <input {...getInputProps()} />
          <p style={{ margin: 0 }}>🐸 Drag a .slp file here 🐸</p>
        </div>
        <div>
          {acceptedFiles.map(file => (
            <p>{file.name}</p>
          ))}
        </div>
      </div>
    );
  }

  if (loadState === LoadState.LOADING) {
    return (
      <div className="container">
        {head}
        <p>Loading...</p>
      </div>
    );
  }

  if (loadState === LoadState.ERROR) {
    return (
      <div className="container">
        {head}
        <p>Couldn't process your file 😢</p>
      </div>
    );
  }

  const playerIds = Object.keys(data.metadata.players).map(id => +id);

  const brush = (
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
  );

  const player = (player, opponent) => (
    <>
      <div style={{ margin: '0px 5px' }}>
        <PlayerInfo
          playerIndex={player}
          stats={data.stats}
          settings={data.settings}
          metadata={data.metadata}
          setCurrentFrames={setCurrentFrames}
        />
        <InputDisplay
          frame={
            frame == null
              ? null
              : frame in data.frames
              ? data.frames[frame].players[player].pre
              : null
          }
        />
      </div>
      <PlayerStats
        setFrame={setFrame}
        frames={data.frames}
        metadata={data.metadata}
        playerIndex={player}
        opponentIndex={opponent}
        stats={data.stats}
      />
    </>
  );

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        padding: `20px 0`,
      }}
    >
      {head}
      <div style={{ display: 'flex' }}>
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
          <div style={{ display: 'flex' }}>
            {player(playerIds[0], playerIds[1])}
          </div>
          <div style={{ display: 'flex' }}>
            {player(playerIds[1], playerIds[0])}
          </div>
        </div>
      </div>
      <div
        style={{
          width: `80%`,
        }}
      >
        <div style={{ position: 'relative' }}>{brush}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="subtitle">{frameCountToGameTime(currentFrames[0])}</p>
          <p className="subtitle">{frameCountToGameTime(currentFrames[1])}</p>
        </div>
        <Line
          title="Percent"
          data={percents}
          frame={frame}
          setFrame={setFrame}
          tooltipText={(frame, data) => {
            if (data[0][1] == null) {
              return '';
            }
            return `Player ${data[0][0] + 1}: ${data[0][1].toFixed(
              1
            )}%\nPlayer ${data[1][0] + 1}: ${data[1][1].toFixed(1)}%`;
          }}
        />
        <Line
          title="Actions per Second"
          data={inputs}
          frame={frame}
          setFrame={setFrame}
          tooltipText={(frame, data) => {
            return `Player ${data[0][0] + 1}: ${data[0][1]}\nPlayer ${
              data[1][0] + 1
            }: ${data[1][1]}`;
          }}
        />
        <Line
          title="Distance between Players"
          data={distances}
          frame={frame}
          setFrame={setFrame}
          tooltipText={(frame, data) => {
            return `${data[0][1]}`;
          }}
        />
      </div>
    </div>
  );
}

export const ususedExport = 'this turns off fast refresh';
