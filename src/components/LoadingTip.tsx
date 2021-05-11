import React from 'react';

const tips = [
  'You can zoom into any section of a game by dragging the handles on the sides of the middle bar',
  'You can inspect the exact frame of a tech or out-of-shield option by mousing over the corresponding rectangle',
  "You can inspect a specific stock by clicking a character's icons",
  "You can change a player's color from the default by clicking on the colored square next to a player's name",
  'You can toggle between APM and APS',
  'You can toggle between vertical, horizontal, and overall distance between players',
  'You can select a frame by hovering over a square on the map',
];

const LoadingTip = () => {
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <>
      <p>Did you know...</p>
      <p>{tip}</p>
    </>
  );
};

export default LoadingTip;
