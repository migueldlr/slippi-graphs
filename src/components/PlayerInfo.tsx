import { GameStartType, MetadataType, StatsType } from '@slippi/slippi-js';
import React from 'react';
import { CHARACTER_DATA } from '../util/ids';
import Image from 'next/image';

interface Props {
  metadata: MetadataType;
  settings: GameStartType;
  stats: StatsType;
  playerIndex: number;
  setCurrentFrames: React.Dispatch<React.SetStateAction<[number, number]>>;
  setSelectedPlayer: React.Dispatch<React.SetStateAction<number>>;
}

type PlayerData = MetadataType['players'][0];

const PlayerInfo = ({
  metadata,
  playerIndex,
  stats,
  settings,
  setCurrentFrames,
  setSelectedPlayer,
}: Props) => {
  const player: PlayerData = metadata.players[playerIndex];
  const charId = +Object.keys(player.characters)[0];
  const char = CHARACTER_DATA[charId];
  const charName = char.name;
  const settingsPlayer = settings.players.find(
    p => p.playerIndex === playerIndex
  );
  const color = char.colors[settingsPlayer.characterColor].toLowerCase();

  const stocks = stats.stocks.filter(
    stock => stock.playerIndex === playerIndex
  );

  const image = (
    <Image
      src={`/stocks/${char.shortName}-${color}.png`}
      layout="fixed"
      height="24"
      width="24"
    />
  );
  const stockIds = [0, 1, 2, 3];

  return (
    <div
      onMouseOver={() => setSelectedPlayer(playerIndex)}
      onMouseLeave={() => setSelectedPlayer(null)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{ height: `1em`, width: `1em`, marginRight: '2px' }}
          className={`p${playerIndex}`}
        />
        <p className={`title p${playerIndex}`}>
          Player {playerIndex + 1} - {charName}
        </p>
      </div>
      {player.names == null ? null : (
        <p className="title">
          {player.names.netplay} ({player.names.code})
        </p>
      )}
      <div style={{ display: 'flex' }}>
        {stockIds.map(stockNum => {
          const stock = stocks[stockNum];
          if (stock == null) {
            return <div key={stockNum}>{image}</div>;
          }
          const died = stock.endFrame != null;

          const frames: [number, number] = [
            Math.max(stock.startFrame, 0),
            stock.endFrame ?? stats.lastFrame,
          ];

          return (
            <div
              style={{ opacity: died ? 0.5 : 1, cursor: 'pointer' }}
              onClick={e => {
                setCurrentFrames(frames);
              }}
              key={stockNum}
            >
              {image}
            </div>
          );
        })}
      </div>
      <div className="tooltip-text">
        <p></p>
      </div>
    </div>
  );
};

export default React.memo(PlayerInfo);
