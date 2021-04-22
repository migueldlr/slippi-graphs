const CHARACTER_IDS = {
  '0': 'Mario',
  '1': 'Fox',
  '2': 'Captain Falcon',
  '3': 'Donkey Kong',
  '4': 'Kirby',
  '5': 'Bowser',
  '6': 'Link',
  '7': 'Sheik',
  '8': 'Ness',
  '9': 'Peach',
  '10': 'Popo',
  '11': 'Nana',
  '12': 'Pikachu',
  '13': 'Samus',
  '14': 'Yoshi',
  '15': 'Jigglypuff',
  '16': 'Mewtwo',
  '17': 'Luigi',
  '18': 'Marth',
  '19': 'Zelda',
  '20': 'Young Link',
  '21': 'Dr. Mario',
  '22': 'Falco',
  '23': 'Pichu',
  '24': 'Mr. Game & Watch',
  '25': 'Ganondorf',
  '26': 'Roy',
  '27': 'Master Hand',
  '28': 'Crazy Hand',
  '29': 'Wireframe Male (Boy)',
  '30': 'Wireframe Female (Girl)',
  '31': 'Giga Bowser',
  '32': 'Sandbag',
};

export type CharacterColor = string;
export interface CharacterInfo {
  name: string;
  shortName: string;
  colors: CharacterColor[];
}
const CHARACTER_DATA: Record<number, CharacterInfo> = {
  2: {
    name: 'Captain Falcon',
    shortName: 'captain',
    colors: ['Original', 'Black', 'Red', 'White', 'Green', 'Blue'],
  },
  3: {
    name: 'Donkey Kong',
    shortName: 'donkey',
    colors: ['Original', 'Black', 'Red', 'Blue', 'Green'],
  },
  1: {
    name: 'Fox',
    shortName: 'fox',
    colors: ['Original', 'Red', 'Blue', 'Green'],
  },
  24: {
    name: 'Mr. Game & Watch',
    shortName: 'gamewatch',
    colors: ['Original', 'Red', 'Blue', 'Green'],
  },
  4: {
    name: 'Kirby',
    shortName: 'kirby',
    colors: ['Original', 'Yellow', 'Blue', 'Red', 'Green', 'White'],
  },
  5: {
    name: 'Bowser',
    shortName: 'koopa',
    colors: ['Original', 'Red', 'Blue', 'Black'],
  },
  6: {
    name: 'Link',
    shortName: 'link',
    colors: ['Original', 'Red', 'Blue', 'Black', 'White'],
  },
  17: {
    name: 'Luigi',
    shortName: 'luigi',
    colors: ['Original', 'White', 'Blue', 'Red'],
  },
  0: {
    name: 'Mario',
    shortName: 'mario',
    colors: ['Original', 'Yellow', 'Black', 'Blue', 'Green'],
  },
  18: {
    name: 'Marth',
    shortName: 'marth',
    colors: ['Original', 'Red', 'Green', 'Black', 'White'],
  },
  16: {
    name: 'Mewtwo',
    shortName: 'mewtwo',
    colors: ['Original', 'Red', 'Blue', 'Green'],
  },
  8: {
    name: 'Ness',
    shortName: 'ness',
    colors: ['Original', 'Yellow', 'Blue', 'Green'],
  },
  9: {
    name: 'Peach',
    shortName: 'peach',
    colors: ['Original', 'Daisy', 'White', 'Blue', 'Green'],
  },
  12: {
    name: 'Pikachu',
    shortName: 'pikachu',
    colors: ['Original', 'Red', 'Party Hat', 'Cowboy Hat'],
  },
  10: {
    name: 'Ice Climbers',
    shortName: 'ice_climber',
    colors: ['Original', 'Green', 'Orange', 'Red'],
  },
  15: {
    name: 'Jigglypuff',
    shortName: 'purin',
    colors: ['Original', 'Red', 'Blue', 'Headband', 'Crown'],
  },
  13: {
    name: 'Samus',
    shortName: 'samus',
    colors: ['Original', 'Pink', 'Black', 'Green', 'Purple'],
  },
  14: {
    name: 'Yoshi',
    shortName: 'yoshi',
    colors: ['Original', 'Red', 'Blue', 'Yellow', 'Pink', 'Cyan'],
  },
  19: {
    name: 'Zelda',
    shortName: 'zelda',
    colors: ['Original', 'Red', 'Blue', 'Green', 'White'],
  },
  7: {
    name: 'Sheik',
    shortName: 'sheik',
    colors: ['Original', 'Red', 'Blue', 'Green', 'White'],
  },
  22: {
    name: 'Falco',
    shortName: 'falco',
    colors: ['Original', 'Red', 'Blue', 'Green'],
  },
  20: {
    name: 'Young Link',
    shortName: 'younglink',
    colors: ['Original', 'Red', 'Blue', 'White', 'Black'],
  },
  21: {
    name: 'Dr. Mario',
    shortName: 'mariod',
    colors: ['Original', 'Red', 'Blue', 'Green', 'Black'],
  },
  26: {
    name: 'Roy',
    shortName: 'roy',
    colors: ['Original', 'Red', 'Blue', 'Green', 'Yellow'],
  },
  23: {
    name: 'Pichu',
    shortName: 'pichu',
    colors: ['Original', 'Red', 'Blue', 'Green'],
  },
  25: {
    name: 'Ganondorf',
    shortName: 'ganon',
    colors: ['Original', 'Red', 'Blue', 'Green', 'Purple'],
  },
};

const STAGE_IDS = {
  2: 'Fountain of Dreams',
  3: 'Pokemon Stadium',
  4: 'Peachs Castle',
  5: 'Kongo Jungle',
  6: 'Brinstar',
  7: 'Corneria',
  8: 'Yoshis Story',
  9: 'Onett',
  10: 'Mute City',
  11: 'Rainbow Cruise',
  12: 'Jungle Japes',
  13: 'Great Bay',
  14: 'Hyrule Temple',
  15: 'Brinstar Depths',
  16: 'Yoshis Island',
  17: 'Green Greens',
  18: 'Fourside',
  19: 'Mushroom Kingdom',
  20: 'Mushroom Kingdom 2',
  22: 'Venom',
  23: 'Poke Floats',
  24: 'Big Blue',
  25: 'Icicle Mountain',
  26: 'Icetop',
  27: 'Flat Zone',
  28: 'Dreamland',
  29: 'Yoshis Island N64',
  30: 'Kongo Jungle N64',
  31: 'Battlefield',
  32: 'Final Destination',
};

const MOVE_IDS = {
  0: 'None',
  1: 'Non-Staling',
  2: 'Jab 1',
  3: 'Jab 2',
  4: 'Jab 3',
  5: 'Rapid Jabs',
  6: 'Dash Attack',
  7: 'Side Tilt',
  8: 'Up Tilt',
  9: 'Down Tilt',
  10: 'Side Smash',
  11: 'Up Smash',
  12: 'Down Smash',
  13: 'Nair',
  14: 'Fair',
  15: 'Bair',
  16: 'Uair',
  17: 'Dair',
  18: 'Neutral Special',
  19: 'Side Special',
  20: 'Up Special',
  21: 'Down Special',
  22: 'Kirby Hat: Mario Neutral Special',
  23: 'Kirby Hat: Fox Neutral Special',
  24: 'Kirby Hat: CFalcon Neutral Special',
  25: 'Kirby Hat: DK Neutral Special',
  26: 'Kirby Hat: Bowser Neutral Special',
  27: 'Kirby Hat: Link Neutral Special',
  28: 'Kirby Hat: Sheik Neutral Special',
  29: 'Kirby Hat: Ness Neutral Special',
  30: 'Kirby Hat: Peach Neutral Special',
  31: 'Kirby Hat: Ice Climber Neutral Special',
  32: 'Kirby Hat: Pikachu Neutral Special',
  33: 'Kirby Hat: Samus Neutral Special',
  34: 'Kirby Hat: Yoshi Neutral Special',
  35: 'Kirby Hat: Jigglypuff Neutral Special',
  36: 'Kirby Hat: Mewtwo Neutral Special',
  37: 'Kirby Hat: Luigi Neutral Special',
  38: 'Kirby Hat: Marth Neutral Special',
  39: 'Kirby Hat: Zelda Neutral Special',
  40: 'Kirby Hat: Young Link Neutral Special',
  41: 'Kirby Hat: Doc Neutral Special',
  42: 'Kirby Hat: Falco Neutral Special',
  43: 'Kirby Hat: Pichu Neutral Special',
  44: 'Kirby Hat: Game & Watch Neutral Special',
  45: 'Kirby Hat: Ganon Neutral Special',
  46: 'Kirby Hat: Roy Neutral Special',
  47: 'Unk',
  48: 'Unk',
  49: 'Unk',
  50: 'Get Up Attack (From Back)',
  51: 'Get Up Attack (From Front)',
  52: 'Pummel',
  53: 'Forward Throw',
  54: 'Back Throw',
  55: 'Up Throw',
  56: 'Down Throw',
  57: 'Cargo Forward Throw',
  58: 'Cargo Back Throw',
  59: 'Cargo Up Throw',
  60: 'Cargo Down Throw',
  61: 'Ledge Get Up Attack 100%+',
  62: 'Ledge Get Up Attack',
  63: 'Beam Sword Jab',
  64: 'Beam Sword Tilt Swing',
  65: 'Beam Sword Smash Swing',
  66: 'Beam Sword Dash Swing',
  67: 'Home Run Bat Jab',
  68: 'Home Run Bat Tilt Swing',
  69: 'Home Run Bat Smash Swing',
  70: 'Home Run Bat Dash Swing',
  71: 'Parasol Jab',
  72: 'Parasol Tilt Swing',
  73: 'Parasol Smash Swing',
  74: 'Parasol Dash Swing',
  75: 'Fan Jab',
  76: 'Fan Tilt Swing',
  77: 'Fan Smash Swing',
  78: 'Fan Dash Swing',
  79: 'Star Rod Jab',
  80: 'Star Rod Tilt Swing',
  81: 'Star Rod Smash Swing',
  82: 'Star Rod Dash Swing',
  83: "Lip's Stick Jab",
  84: "Lip's Stick Tilt Swing",
  85: "Lip's Stick Smash Swing",
  86: "Lip's Stick Dash Swing",
  87: 'Open Parasol',
  88: 'Ray Gun Shoot',
  89: 'Fire Flower Shoot',
  90: 'Screw Attack',
  91: 'Super Scope (Rapid)',
  92: 'Super Scope (Charged)',
  93: 'Hammer',
};

export { CHARACTER_IDS, STAGE_IDS, MOVE_IDS, CHARACTER_DATA };
