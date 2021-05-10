function parseColor(s: string): [number, number, number] {
  const m = s.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (m) {
    return [+m[1], +m[2], +m[3]];
  }
  return hexToRgb(s);
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function componentToHex(c: number) {
  return c.toString(16).padStart(2, '0');
}

export function rgbToHex([r, g, b]: [number, number, number]) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function getRGBFromCSS(playerId: number) {
  const color = getComputedStyle(document.documentElement).getPropertyValue(
    `--p${playerId}`
  );

  return parseColor(color);
}

export function getOpacity(config?: {
  highlight?: boolean;
  antihighlight?: boolean;
}) {
  const { highlight, antihighlight } = config ?? {};
  return highlight ? 1 : antihighlight ? 0.01 : 0.05;
}
