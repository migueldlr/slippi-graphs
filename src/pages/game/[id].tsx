import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import GameInfo from '../../components/GameInfo';
import Map from '../../components/Map';
import Line from '../../components/Line';
import {
  actionCalc,
  distanceBetween,
  filterData,
  frameCountToGameTime,
  frameCountToSeconds,
  getAPM,
  getPercents,
} from '../../util/calc';
import { Data, FlatData, LoadState } from '../../util/types';
import { fetch_retry } from '../../util/util';
import Brush from '../../components/Brush';
import InputDisplay from '../../components/InputDisplay';
import PlayerInfo from '../../components/PlayerInfo';
import PlayerStats from '../../components/PlayerStats';
import Head from 'next/head';
import { CHARACTER_DATA } from '../../util/ids';
import Spinner from '../../components/Spinner';
import Heatmap from '../../components/Heatmap';
import { ActionCountsType } from '@slippi/slippi-js';

const Game = () => {
  const [loadState, setLoadState] = useState<LoadState>(LoadState.LOADING);
  const [origData, setOrigData] = useState<Data | null>(null);

  const [currentFrames, setCurrentFrames] = useState<[number, number]>(null);
  const canCalc = origData != null && currentFrames != null;
  const data = useMemo(
    () => (canCalc ? filterData(origData, currentFrames) : null),
    [origData, currentFrames]
  );

  const [frame, setFrame] = useState<number>();
  const [selectedPlayer, setSelectedPlayer] = useState<number>();
  const router = useRouter();

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

  const actions: ActionCountsType[] | null = useMemo(
    () =>
      canCalc
        ? actionCalc(origData.frames, origData.settings, currentFrames)
        : null,
    [origData, currentFrames]
  );

  useEffect(() => {
    // console.log(router.query);
    if (!router.isReady) {
      return;
    }
    (async () => {
      const id = router.query['id'];
      let url = `https://melee-vis-data-parsed.s3.amazonaws.com/${id}.json`;
      if (id === '1') {
        url = '/api/game';
      }
      try {
        const res2 = await fetch_retry(5, url);
        const data: Data = await res2.json();
        // console.log(data.frames[0].players[0]);
        setOrigData(data);
        setCurrentFrames([0, data.stats.lastFrame]);
        setLoadState(LoadState.SUCCESS);
      } catch (e) {
        setLoadState(LoadState.ERROR);
      }
    })();
  }, [router.isReady]);

  if (loadState === LoadState.IDLE) {
    return (
      <div className="container">
        <p>Bleh</p>
      </div>
    );
  }

  if (loadState === LoadState.LOADING) {
    return (
      <div className="container">
        <Head>
          <title>Slippi Graphs</title>
        </Head>
        <Spinner />
      </div>
    );
  }

  if (loadState === LoadState.ERROR) {
    return (
      <div className="container">
        <Head>
          <title>Slippi Graphs</title>
        </Head>
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
          conversion.moves[0].playerIndex,
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
          setSelectedPlayer={setSelectedPlayer}
        />
        <InputDisplay
          frame={
            frame == null
              ? null
              : frame in data.frames
              ? data.frames[frame].players[player].pre
              : null
          }
          post={
            frame == null
              ? null
              : frame in data.frames
              ? data.frames[frame].players[player].post
              : null
          }
        />
      </div>
      <PlayerStats
        frame={frame}
        setFrame={setFrame}
        frames={data.frames}
        metadata={data.metadata}
        playerIndex={player}
        opponentIndex={opponent}
        stats={data.stats}
        actions={actions.find(a => a.playerIndex === player)}
      />
    </>
  );

  const head = (
    <Head>
      <title>
        {playerIds
          .map(
            id =>
              data.metadata.players[id].names?.netplay ??
              CHARACTER_DATA[
                +Object.keys(data.metadata.players[id].characters)[0]
              ].name
          )
          .join(' vs ')}
        {' - '}
        Slippi Graphs
      </title>
    </Head>
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
          <GameInfo currentFrames={currentFrames} settings={data.settings} />
          <Heatmap
            data={origData}
            currentFrames={currentFrames}
            frame={frame}
            setFrame={setFrame}
            selectedPlayer={selectedPlayer}
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
};

export default Game;
