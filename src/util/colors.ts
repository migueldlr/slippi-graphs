const colors = {
  0: [255, 0, 0],
  1: [17, 0, 255],
  2: [219, 209, 70],
  3: [5, 156, 0],
};
export function getColor(
  playerId: number,
  config?: { highlight?: boolean; antihighlight?: boolean }
) {
  const { highlight, antihighlight } = config ?? {};
  const opacity = highlight ? 1 : antihighlight ? 0.01 : 0.1;
  return `rgba(${colors[playerId][0]}, ${colors[playerId][1]}, ${colors[playerId][2]}, ${opacity})`;
}
