import { Action } from './types';

const ACTION_STATES: Record<number, Action> = {
  '0': { id: 0, state: 'DeadDown', notes: 'Standard downward death' },
  '1': { id: 1, state: 'DeadLeft', notes: 'Standard leftward death' },
  '2': { id: 2, state: 'DeadRight', notes: 'Standard rightward death' },
  '3': {
    id: 3,
    state: 'DeadUp',
    notes: 'Upward death used in 1P "Team Kirby"',
  },
  '4': { id: 4, state: 'DeadUpStar', notes: 'Standard Star KO' },
  '5': {
    id: 5,
    state: 'DeadUpStarIce',
    notes: 'Star KO while encased in ice (Freezie)',
  },
  '6': { id: 6, state: '', notes: '64-esque front fall' },
  '7': { id: 7, state: '', notes: '' },
  '8': { id: 8, state: 'DeadUpFallHitCamera', notes: '' },
  '9': { id: 9, state: 'DeadUpFallIce', notes: '' },
  '10': { id: 10, state: 'DeadUpFallHitCameraIce', notes: '' },
  '11': { id: 11, state: 'Sleep', notes: 'Nothing' },
  '12': { id: 12, state: 'Rebirth', notes: 'Entering on halo' },
  '13': { id: 13, state: 'RebirthWait', notes: 'Waiting on halo' },
  '14': { id: 14, state: 'Wait', notes: 'Standing state' },
  '15': { id: 15, state: 'WalkSlow', notes: '' },
  '16': { id: 16, state: 'WalkMiddle', notes: '' },
  '17': { id: 17, state: 'WalkFast', notes: '' },
  '18': { id: 18, state: 'Turn', notes: '' },
  '19': { id: 19, state: 'TurnRun', notes: '' },
  '20': { id: 20, state: 'Dash', notes: '' },
  '21': { id: 21, state: 'Run', notes: '' },
  '22': { id: 22, state: 'RunDirect', notes: '' },
  '23': { id: 23, state: 'RunBrake', notes: '' },
  '24': { id: 24, state: 'KneeBend', notes: 'Pre-jump animation' },
  '25': { id: 25, state: 'JumpF', notes: 'First jump forward' },
  '26': { id: 26, state: 'JumpB', notes: 'First jump backward' },
  '27': { id: 27, state: 'JumpAerialF', notes: 'Aerial jump forward' },
  '28': { id: 28, state: 'JumpAerialB', notes: 'Aerial jump backward' },
  '29': { id: 29, state: 'Fall', notes: 'Falling straight down' },
  '30': { id: 30, state: 'FallF', notes: 'Falling with forward DI' },
  '31': { id: 31, state: 'FallB', notes: 'Falling with backward DI' },
  '32': { id: 32, state: 'FallAerial', notes: 'Falling after the second jump' },
  '33': {
    id: 33,
    state: 'FallAerialF',
    notes: 'Falling after the second jump with forward DI',
  },
  '34': {
    id: 34,
    state: 'FallAerialB',
    notes: 'Falling after the second jump with backward DI',
  },
  '35': {
    id: 35,
    state: 'FallSpecial',
    notes: 'Special fall after UpB or airdodge',
  },
  '36': {
    id: 36,
    state: 'FallSpecialF',
    notes: 'Special fall with forward DI',
  },
  '37': {
    id: 37,
    state: 'FallSpecialB',
    notes: 'Special fall with backward DI',
  },
  '38': { id: 38, state: 'DamageFall', notes: 'Tumbling' },
  '39': { id: 39, state: 'Squat', notes: 'Going from stand to crouch' },
  '40': { id: 40, state: 'SquatWait', notes: 'Crouching' },
  '41': { id: 41, state: 'SquatRv', notes: 'Going from crouch to stand' },
  '42': { id: 42, state: 'Landing', notes: '' },
  '43': {
    id: 43,
    state: 'LandingFallSpecial',
    notes: 'Landing from special fall',
  },
  '44': { id: 44, state: 'Attack11', notes: 'Jab 1' },
  '45': { id: 45, state: 'Attack12', notes: 'Jab 2' },
  '46': { id: 46, state: 'Attack13', notes: 'Jab 3' },
  '47': { id: 47, state: 'Attack100Start', notes: 'Start of a rapid jab' },
  '48': { id: 48, state: 'Attack100Loop', notes: 'Middle of a rapid jab' },
  '49': { id: 49, state: 'Attack100End', notes: 'End of a rapid jab' },
  '50': { id: 50, state: 'AttackDash', notes: 'Dash attack' },
  '51': { id: 51, state: 'AttackS3Hi', notes: 'High Ftilt' },
  '52': { id: 52, state: 'AttackS3HiS', notes: 'High-mid Ftilt' },
  '53': { id: 53, state: 'AttackS3S', notes: 'Mid Ftilt' },
  '54': { id: 54, state: 'AttackS3LwS', notes: 'Low-mid Ftilt' },
  '55': { id: 55, state: 'AttackS3Lw', notes: 'Low Ftilt' },
  '56': { id: 56, state: 'AttackHi3', notes: 'Uptilt' },
  '57': { id: 57, state: 'AttackLw3', notes: 'Downtilt' },
  '58': { id: 58, state: 'AttackS4Hi', notes: 'High Fsmash' },
  '59': { id: 59, state: 'AttackS4HiS', notes: 'High-mid Fsmash' },
  '60': { id: 60, state: 'AttackS4S', notes: 'Mid Fsmash' },
  '61': { id: 61, state: 'AttackS4LwS', notes: 'Low-mid Fsmash' },
  '62': { id: 62, state: 'AttackS4Lw', notes: 'Low Fsmash' },
  '63': { id: 63, state: 'AttackHi4', notes: 'Upsmash' },
  '64': { id: 64, state: 'AttackLw4', notes: 'Downsmash' },
  '65': { id: 65, state: 'AttackAirN', notes: 'Nair' },
  '66': { id: 66, state: 'AttackAirF', notes: 'Fair' },
  '67': { id: 67, state: 'AttackAirB', notes: 'Bair' },
  '68': { id: 68, state: 'AttackAirHi', notes: 'Uair' },
  '69': { id: 69, state: 'AttackAirLw', notes: 'Dair' },
  '70': { id: 70, state: 'LandingAirN', notes: 'Landing during Nair' },
  '71': { id: 71, state: 'LandingAirF', notes: 'Landing during Fair' },
  '72': { id: 72, state: 'LandingAirB', notes: 'Landing during Bair' },
  '73': { id: 73, state: 'LandingAirHi', notes: 'Landing during Uair' },
  '74': { id: 74, state: 'LandingAirLw', notes: 'Landing during Dair' },
  '75': { id: 75, state: 'DamageHi1', notes: '' },
  '76': { id: 76, state: 'DamageHi2', notes: '' },
  '77': { id: 77, state: 'DamageHi3', notes: '' },
  '78': { id: 78, state: 'DamageN1', notes: '' },
  '79': { id: 79, state: 'DamageN2', notes: '' },
  '80': { id: 80, state: 'DamageN3', notes: '' },
  '81': { id: 81, state: 'DamageLw1', notes: '' },
  '82': { id: 82, state: 'DamageLw2', notes: '' },
  '83': { id: 83, state: 'DamageLw3', notes: '' },
  '84': { id: 84, state: 'DamageAir1', notes: '' },
  '85': { id: 85, state: 'DamageAir2', notes: '' },
  '86': { id: 86, state: 'DamageAir3', notes: '' },
  '87': { id: 87, state: 'DamageFlyHi', notes: '' },
  '88': { id: 88, state: 'DamageFlyN', notes: '' },
  '89': { id: 89, state: 'DamageFlyLw', notes: '' },
  '90': { id: 90, state: 'DamageFlyTop', notes: '' },
  '91': { id: 91, state: 'DamageFlyRoll', notes: '' },
  '92': { id: 92, state: 'LightGet', notes: 'Picking up an item' },
  '93': {
    id: 93,
    state: 'HeavyGet',
    notes: 'Picking up a heavy item (barrel)',
  },
  '94': {
    id: 94,
    state: 'LightThrowF',
    notes: 'Throwing items at standard speed',
  },
  '95': { id: 95, state: 'LightThrowB', notes: '' },
  '96': { id: 96, state: 'LightThrowHi', notes: '' },
  '97': { id: 97, state: 'LightThrowLw', notes: '' },
  '98': { id: 98, state: 'LightThrowDash', notes: '' },
  '99': { id: 99, state: 'LightThrowDrop', notes: '' },
  '100': { id: 100, state: 'LightThrowAirF', notes: '' },
  '101': { id: 101, state: 'LightThrowAirB', notes: '' },
  '102': { id: 102, state: 'LightThrowAirHi', notes: '' },
  '103': { id: 103, state: 'LightThrowAirLw', notes: '' },
  '104': { id: 104, state: 'HeavyThrowF', notes: '' },
  '105': { id: 105, state: 'HeavyThrowB', notes: '' },
  '106': { id: 106, state: 'HeavyThrowHi', notes: '' },
  '107': { id: 107, state: 'HeavyThrowLw', notes: '' },
  '108': {
    id: 108,
    state: 'LightThrowF4',
    notes: 'Throwing items at Smash speed',
  },
  '109': { id: 109, state: 'LightThrowB4', notes: '' },
  '110': { id: 110, state: 'LightThrowHi4', notes: '' },
  '111': { id: 111, state: 'LightThrowLw4', notes: '' },
  '112': { id: 112, state: 'LightThrowAirF4', notes: '' },
  '113': { id: 113, state: 'LightThrowAirB4', notes: '' },
  '114': { id: 114, state: 'LightThrowAirHi4', notes: '' },
  '115': { id: 115, state: 'LightThrowAirLw4', notes: '' },
  '116': { id: 116, state: 'HeavyThrowF4', notes: '' },
  '117': { id: 117, state: 'HeavyThrowB4', notes: '' },
  '118': { id: 118, state: 'HeavyThrowHi4', notes: '' },
  '119': { id: 119, state: 'HeavyThrowLw4', notes: '' },
  '120': { id: 120, state: 'SwordSwing1', notes: 'Beam sword swings' },
  '121': { id: 121, state: 'SwordSwing3', notes: '' },
  '122': { id: 122, state: 'SwordSwing4', notes: '' },
  '123': { id: 123, state: 'SwordSwingDash', notes: '' },
  '124': { id: 124, state: 'BatSwing1', notes: 'Home Run Bat swings' },
  '125': { id: 125, state: 'BatSwing3', notes: '' },
  '126': { id: 126, state: 'BatSwing4', notes: '' },
  '127': { id: 127, state: 'BatSwingDash', notes: '' },
  '128': { id: 128, state: 'ParasolSwing1', notes: 'Parasol swings' },
  '129': { id: 129, state: 'ParasolSwing3', notes: '' },
  '130': { id: 130, state: 'ParasolSwing4', notes: '' },
  '131': { id: 131, state: 'ParasolSwingDash', notes: '' },
  '132': { id: 132, state: 'HarisenSwing1', notes: 'Fan swings' },
  '133': { id: 133, state: 'HarisenSwing3', notes: '' },
  '134': { id: 134, state: 'HarisenSwing4', notes: '' },
  '135': { id: 135, state: 'HarisenSwingDash', notes: '' },
  '136': { id: 136, state: 'StarRodSwing1', notes: 'Star Rod swings' },
  '137': { id: 137, state: 'StarRodSwing3', notes: '' },
  '138': { id: 138, state: 'StarRodSwing4', notes: '' },
  '139': { id: 139, state: 'StarRodSwingDash', notes: '' },
  '140': { id: 140, state: 'LipStickSwing1', notes: "Lip's Stick swings" },
  '141': { id: 141, state: 'LipStickSwing3', notes: '' },
  '142': { id: 142, state: 'LipStickSwing4', notes: '' },
  '143': { id: 143, state: 'LipStickSwingDash', notes: '' },
  '144': { id: 144, state: 'ItemParasolOpen', notes: '' },
  '145': { id: 145, state: 'ItemParasolFall', notes: '' },
  '146': { id: 146, state: 'ItemParasolFallSpecial', notes: '' },
  '147': { id: 147, state: 'ItemParasolDamageFall', notes: '' },
  '148': { id: 148, state: 'LGunShoot', notes: 'Raygun shots' },
  '149': { id: 149, state: 'LGunShootAir', notes: '' },
  '150': { id: 150, state: 'LGunShootEmpty', notes: '' },
  '151': { id: 151, state: 'LGunShootAirEmpty', notes: '' },
  '152': { id: 152, state: 'FireFlowerShoot', notes: '' },
  '153': { id: 153, state: 'FireFlowerShootAir', notes: '' },
  '154': { id: 154, state: 'ItemScrew', notes: '' },
  '155': { id: 155, state: 'ItemScrewAir', notes: '' },
  '156': { id: 156, state: 'DamageScrew', notes: '' },
  '157': { id: 157, state: ' DamageScrewAir', notes: '' },
  '158': { id: 158, state: 'ItemScopeStart', notes: '' },
  '159': { id: 159, state: 'ItemScopeRapid', notes: '' },
  '160': { id: 160, state: 'ItemScopeFire', notes: '' },
  '161': { id: 161, state: 'ItemScopeEnd', notes: '' },
  '162': { id: 162, state: 'ItemScopeAirStart', notes: '' },
  '163': { id: 163, state: 'ItemScopeAirRapid', notes: '' },
  '164': { id: 164, state: 'ItemScopeAirFire', notes: '' },
  '165': { id: 165, state: 'ItemScopeAirEnd', notes: '' },
  '166': { id: 166, state: 'ItemScopeStartEmpty', notes: '' },
  '167': { id: 167, state: 'ItemScopeRapidEmpty', notes: '' },
  '168': { id: 168, state: 'ItemScopeFireEmpty', notes: '' },
  '169': { id: 169, state: 'ItemScopeEndEmpty', notes: '' },
  '170': { id: 170, state: 'ItemScopeAirStartEmpty', notes: '' },
  '171': { id: 171, state: 'ItemScopeAirRapidEmpty', notes: '' },
  '172': { id: 172, state: 'ItemScopeAirFireEmpty', notes: '' },
  '173': { id: 173, state: 'ItemScopeAirEndEmpty', notes: '' },
  '174': { id: 174, state: 'LiftWait', notes: '' },
  '175': { id: 175, state: 'LiftWalk1', notes: '' },
  '176': { id: 176, state: 'LiftWalk2', notes: '' },
  '177': { id: 177, state: 'LiftTurn', notes: '' },
  '178': { id: 178, state: 'GuardOn', notes: 'Shield startup' },
  '179': { id: 179, state: 'Guard', notes: 'Holding shield' },
  '180': { id: 180, state: 'GuardOff', notes: 'Shield release' },
  '181': { id: 181, state: 'GuardSetOff', notes: 'Shield stun' },
  '182': { id: 182, state: 'GuardReflect', notes: '' },
  '183': { id: 183, state: 'DownBoundU', notes: 'The missed tech bounce' },
  '184': { id: 184, state: 'DownWaitU', notes: 'Lying on ground facing up' },
  '185': {
    id: 185,
    state: 'DownDamageU',
    notes: 'Getting hit by a low knockback move lying on ground facing up',
  },
  '186': { id: 186, state: 'DownStandU', notes: 'Neutral getup' },
  '187': {
    id: 187,
    state: 'DownAttackU',
    notes: 'Get up attack from ground face up',
  },
  '188': { id: 188, state: 'DownFowardU', notes: 'Missed tech roll forward' },
  '189': { id: 189, state: 'DownBackU', notes: 'Missed tech roll backward' },
  '190': { id: 190, state: 'DownSpotU', notes: 'Does not appear to be used' },
  '191': { id: 191, state: 'DownBoundD', notes: 'The missed tech bounce' },
  '192': { id: 192, state: 'DownWaitD', notes: 'Lying on ground facing down' },
  '193': {
    id: 193,
    state: 'DownDamageD',
    notes:
      'Getting hit by a low knockback move lying on the ground facing down',
  },
  '194': { id: 194, state: 'DownStandD', notes: 'Neutral getup' },
  '195': {
    id: 195,
    state: 'DownAttackD',
    notes: 'Get up attack from ground face down',
  },
  '196': { id: 196, state: 'DownFowardD', notes: 'Missed tech roll forward' },
  '197': { id: 197, state: 'DownBackD', notes: 'Missed tech roll backward' },
  '198': { id: 198, state: 'DownSpotD', notes: 'Does not appear to be used' },
  '199': { id: 199, state: 'Passive', notes: 'Neutral tech' },
  '200': { id: 200, state: 'PassiveStandF', notes: 'Forward tech' },
  '201': { id: 201, state: 'PassiveStandB', notes: 'Backward tech' },
  '202': { id: 202, state: 'PassiveWall', notes: 'Wall tech' },
  '203': {
    id: 203,
    state: 'PassiveWallJump',
    notes: 'Walljump tech/plain walljump',
  },
  '204': { id: 204, state: 'PassiveCeil', notes: 'Ceiling tech' },
  '205': { id: 205, state: 'ShieldBreakFly', notes: '' },
  '206': { id: 206, state: 'ShieldBreakFall', notes: '' },
  '207': { id: 207, state: 'ShieldBreakDownU', notes: '' },
  '208': { id: 208, state: 'ShieldBreakDownD', notes: '' },
  '209': { id: 209, state: 'ShieldBreakStandU', notes: '' },
  '210': { id: 210, state: 'ShieldBreakStandD', notes: '' },
  '211': { id: 211, state: 'FuraFura', notes: 'Shield-break tottering' },
  '212': { id: 212, state: 'Catch', notes: 'Grab' },
  '213': {
    id: 213,
    state: 'CatchPull',
    notes: 'Successfully grabbing a character - pulling them in',
  },
  '214': { id: 214, state: 'CatchDash', notes: '' },
  '215': { id: 215, state: 'CatchDashPull', notes: '' },
  '216': {
    id: 216,
    state: 'CatchWait',
    notes: 'Grabbing and holding a character',
  },
  '217': { id: 217, state: 'CatchAttack', notes: 'Pummel' },
  '218': {
    id: 218,
    state: 'CatchCut',
    notes: "When opponent breaks of a character's grab",
  },
  '219': { id: 219, state: 'ThrowF', notes: 'Forward throw' },
  '220': { id: 220, state: 'ThrowB', notes: 'Back throw' },
  '221': { id: 221, state: 'ThrowHi', notes: 'Up throw' },
  '222': { id: 222, state: 'ThrowLw', notes: 'Down throw' },
  '223': { id: 223, state: 'CapturePulledHi', notes: '' },
  '224': { id: 224, state: 'CaptureWaitHi', notes: '' },
  '225': { id: 225, state: 'CaptureDamageHi', notes: '' },
  '226': { id: 226, state: 'CapturePulledLw', notes: 'Becoming grabbed' },
  '227': { id: 227, state: 'CaptureWaitLw', notes: 'When grabbed' },
  '228': { id: 228, state: 'CaptureDamageLw', notes: 'Pummeled' },
  '229': { id: 229, state: 'CaptureCut', notes: 'Grab release' },
  '230': { id: 230, state: 'CaptureJump', notes: 'Jumping mash out of grab' },
  '231': { id: 231, state: 'CaptureNeck', notes: 'Does not appear to be used' },
  '232': { id: 232, state: 'CaptureFoot', notes: 'Does not appear to be used' },
  '233': { id: 233, state: 'EscapeF', notes: 'roll forward' },
  '234': { id: 234, state: 'EscapeB', notes: 'roll backward' },
  '235': { id: 235, state: 'Escape', notes: 'spotdodge' },
  '236': { id: 236, state: 'EscapeAir', notes: 'airdodge' },
  '237': { id: 237, state: 'ReboundStop', notes: '' },
  '238': { id: 238, state: 'Rebound', notes: '' },
  '239': { id: 239, state: 'ThrownF', notes: 'Thrown forward' },
  '240': { id: 240, state: 'ThrownB', notes: 'Thrown backward' },
  '241': { id: 241, state: 'ThrownHi', notes: 'Thrown up' },
  '242': { id: 242, state: 'ThrownLw', notes: 'Thrown down' },
  '243': {
    id: 243,
    state: 'ThrownLwWomen',
    notes: 'Thrown down as a female character',
  },
  '244': { id: 244, state: 'Pass', notes: 'Drop through platform' },
  '245': { id: 245, state: 'Ottotto', notes: 'Ledge teeter' },
  '246': { id: 246, state: 'OttottoWait', notes: '' },
  '247': { id: 247, state: 'FlyReflectWall', notes: 'Missed walltech' },
  '248': { id: 248, state: 'FlyReflectCeil', notes: 'Missed ceiling tech' },
  '249': { id: 249, state: 'StopWall', notes: 'Wall bonk' },
  '250': { id: 250, state: 'StopCeil', notes: 'Ceiling bonk' },
  '251': { id: 251, state: 'MissFoot', notes: 'Backward shield slideoff' },
  '252': { id: 252, state: 'CliffCatch', notes: 'Catching the ledge' },
  '253': { id: 253, state: 'CliffWait', notes: 'Hanging on the ledge' },
  '254': {
    id: 254,
    state: 'CliffClimbSlow',
    notes: 'Climbing the ledge (100%+)',
  },
  '255': {
    id: 255,
    state: 'CliffClimbQuick',
    notes: 'Climbing the ledge (<100%)',
  },
  '256': { id: 256, state: 'CliffAttackSlow', notes: 'Ledge attack (100%+)' },
  '257': { id: 257, state: 'CliffAttackQuick', notes: 'Ledge attack (<100%)' },
  '258': { id: 258, state: 'CliffEscapeSlow', notes: 'Ledge roll (100%+)' },
  '259': { id: 259, state: 'CliffEscapeQuick', notes: 'Ledge roll (<100%)' },
  '260': {
    id: 260,
    state: 'CliffJumpSlow1',
    notes: 'Ledge jump/tournament winner (100%+)',
  },
  '261': {
    id: 261,
    state: 'CliffJumpSlow2',
    notes: 'Ledge jump/tournament winner (100%+)',
  },
  '262': {
    id: 262,
    state: 'CliffJumpQuick1',
    notes: 'Ledge jump/tournament winner (<100%)',
  },
  '263': {
    id: 263,
    state: 'CliffJumpQuick2',
    notes: 'Ledge jump/tournament winner (<100%)',
  },
  '264': { id: 264, state: 'AppealR', notes: 'Taunt right' },
  '265': { id: 265, state: 'AppealL', notes: 'Taunt left' },
  '266': { id: 266, state: 'ShoulderedWait', notes: 'DK carry' },
  '267': { id: 267, state: 'ShoulderedWalkSlow', notes: '' },
  '268': { id: 268, state: 'ShoulderedWalkMiddle', notes: '' },
  '269': { id: 269, state: 'ShoulderedWalkFast', notes: '' },
  '270': { id: 270, state: 'ShoulderedTurn', notes: '' },
  '271': { id: 271, state: 'ThrownFF', notes: 'DK carry throws' },
  '272': { id: 272, state: 'ThrownFB', notes: '' },
  '273': { id: 273, state: 'ThrownFHi', notes: '' },
  '274': { id: 274, state: 'ThrownFLw', notes: '' },
  '275': { id: 275, state: 'CaptureCaptain', notes: '' },
  '276': { id: 276, state: 'CaptureYoshi', notes: '' },
  '277': { id: 277, state: 'YoshiEgg', notes: '' },
  '278': { id: 278, state: 'CaptureKoopa', notes: '' },
  '279': { id: 279, state: 'CaptureDamageKoopa', notes: '' },
  '280': { id: 280, state: 'CaptureWaitKoopa', notes: '' },
  '281': { id: 281, state: 'ThrownKoopaF', notes: '' },
  '282': { id: 282, state: 'ThrownKoopaB', notes: '' },
  '283': { id: 283, state: 'CaptureKoopaAir', notes: '' },
  '284': { id: 284, state: 'CaptureDamageKoopaAir', notes: '' },
  '285': { id: 285, state: 'CaptureWaitKoopaAir', notes: '' },
  '286': { id: 286, state: 'ThrownKoopaAirF', notes: '' },
  '287': { id: 287, state: 'ThrownKoopaAirB', notes: '' },
  '288': { id: 288, state: 'CaptureKirby', notes: '' },
  '289': { id: 289, state: 'CaptureWaitKirby', notes: '' },
  '290': { id: 290, state: 'ThrownKirbyStar', notes: '' },
  '291': { id: 291, state: 'ThrownCopyStar', notes: '' },
  '292': { id: 292, state: 'ThrownKirby', notes: '' },
  '293': { id: 293, state: 'BarrelWait', notes: '' },
  '294': {
    id: 294,
    state: 'Bury',
    notes: 'Stuck in ground by DK side B or similar',
  },
  '295': { id: 295, state: 'BuryWait', notes: '' },
  '296': { id: 296, state: 'BuryJump', notes: '' },
  '297': {
    id: 297,
    state: 'DamageSong',
    notes: 'Put to sleep by Jigglypuff up B or similar',
  },
  '298': { id: 298, state: 'DamageSongWait', notes: '' },
  '299': { id: 299, state: 'DamageSongRv', notes: '' },
  '300': { id: 300, state: 'DamageBind', notes: "Hit by Mewtwo's Disable" },
  '301': {
    id: 301,
    state: 'CaptureMewtwo',
    notes: 'Does not appear to be used',
  },
  '302': {
    id: 302,
    state: 'CaptureMewtwoAir',
    notes: 'Does not appear to be used',
  },
  '303': { id: 303, state: 'ThrownMewtwo', notes: "Hit by Mewtwo's Confusion" },
  '304': {
    id: 304,
    state: 'ThrownMewtwoAir',
    notes: "Hit by Mewtwo's Confusion",
  },
  '305': { id: 305, state: 'WarpStarJump', notes: '' },
  '306': { id: 306, state: 'WarpStarFall', notes: '' },
  '307': { id: 307, state: 'HammerWait', notes: '' },
  '308': { id: 308, state: 'HammerWalk', notes: '' },
  '309': { id: 309, state: 'HammerTurn', notes: '' },
  '310': { id: 310, state: 'HammerKneeBend', notes: '' },
  '311': { id: 311, state: 'HammerFall', notes: '' },
  '312': { id: 312, state: 'HammerJump', notes: '' },
  '313': { id: 313, state: 'HammerLanding', notes: '' },
  '314': {
    id: 314,
    state: 'KinokoGiantStart',
    notes: 'Super/Poison mushroom states',
  },
  '315': { id: 315, state: 'KinokoGiantStartAir', notes: '' },
  '316': { id: 316, state: 'KinokoGiantEnd', notes: '' },
  '317': { id: 317, state: 'KinokoGiantEndAir', notes: '' },
  '318': { id: 318, state: 'KinokoSmallStart', notes: '' },
  '319': { id: 319, state: 'KinokoSmallStartAir', notes: '' },
  '320': { id: 320, state: 'KinokoSmallEnd', notes: '' },
  '321': { id: 321, state: 'KinokoSmallEndAir', notes: '' },
  '322': { id: 322, state: 'Entry', notes: 'Warp in at beginning of match.' },
  '323': { id: 323, state: 'EntryStart', notes: '' },
  '324': { id: 324, state: 'EntryEnd', notes: '' },
  '325': { id: 325, state: 'DamageIce', notes: '' },
  '326': { id: 326, state: 'DamageIceJump', notes: '' },
  '327': { id: 327, state: 'CaptureMasterhand', notes: '' },
  '328': { id: 328, state: 'CapturedamageMasterhand', notes: '' },
  '329': { id: 329, state: 'CapturewaitMasterhand', notes: '' },
  '330': { id: 330, state: 'ThrownMasterhand', notes: '' },
  '331': { id: 331, state: 'CaptureKirbyYoshi', notes: '' },
  '332': { id: 332, state: 'KirbyYoshiEgg', notes: '' },
  '333': { id: 333, state: 'CaptureLeadead', notes: '' },
  '334': { id: 334, state: 'CaptureLikelike', notes: '' },
  '335': {
    id: 335,
    state: 'DownReflect',
    notes:
      'A very rare action state where the character transitions from a DownBoundU or DownBoundD (missed tech) state into a wall bounce. This state is not techable and neither is the probable next floor hit. Most commonly encountered on Pokémon Stadium',
  },
  '336': { id: 336, state: 'CaptureCrazyhand', notes: '' },
  '337': { id: 337, state: 'CapturedamageCrazyhand', notes: '' },
  '338': { id: 338, state: 'CapturewaitCrazyhand', notes: '' },
  '339': { id: 339, state: 'ThrownCrazyhand', notes: '' },
  '340': { id: 340, state: 'BarrelCannonWait', notes: '' },
  '341': {
    id: 341,
    state: 'Wait1',
    notes: 'No general action states at this point or later are used',
  },
  '342': { id: 342, state: 'Wait2', notes: '' },
  '343': { id: 343, state: 'Wait3', notes: '' },
  '344': { id: 344, state: 'Wait4', notes: '' },
  '345': { id: 345, state: 'WaitItem', notes: '' },
  '346': { id: 346, state: 'SquatWait1', notes: '' },
  '347': { id: 347, state: 'SquatWait2', notes: '' },
  '348': { id: 348, state: 'SquatWaitItem', notes: '' },
  '349': { id: 349, state: 'GuardDamage', notes: '' },
  '350': { id: 350, state: 'EscapeN', notes: '' },
  '351': { id: 351, state: 'AttackS4Hold', notes: '' },
  '352': { id: 352, state: 'HeavyWalk1', notes: '' },
  '353': { id: 353, state: 'HeavyWalk2', notes: '' },
  '354': { id: 354, state: 'ItemHammerWait', notes: '' },
  '355': { id: 355, state: 'ItemHammerMove', notes: '' },
  '356': { id: 356, state: 'ItemBlind', notes: '' },
  '357': { id: 357, state: 'DamageElec', notes: '' },
  '358': { id: 358, state: 'FuraSleepStart', notes: '' },
  '359': { id: 359, state: 'FuraSleepLoop', notes: '' },
  '360': { id: 360, state: 'FuraSleepEnd', notes: '' },
  '361': { id: 361, state: 'WallDamage', notes: '' },
  '362': { id: 362, state: 'CliffWait1', notes: '' },
  '363': { id: 363, state: 'CliffWait2', notes: '' },
  '364': { id: 364, state: 'SlipDown', notes: '' },
  '365': { id: 365, state: 'Slip', notes: '' },
  '366': { id: 366, state: 'SlipTurn', notes: '' },
  '367': { id: 367, state: 'SlipDash', notes: '' },
  '368': { id: 368, state: 'SlipWait', notes: '' },
  '369': { id: 369, state: 'SlipStand', notes: '' },
  '370': { id: 370, state: 'SlipAttack', notes: '' },
  '371': { id: 371, state: 'SlipEscapeF', notes: '' },
  '372': { id: 372, state: 'SlipEscapeB', notes: '' },
  '373': { id: 373, state: 'AppealS', notes: '' },
  '374': { id: 374, state: 'Zitabata', notes: '' },
  '375': { id: 375, state: 'CaptureKoopaHit', notes: '' },
  '376': { id: 376, state: 'ThrownKoopaEndF', notes: '' },
  '377': { id: 377, state: 'ThrownKoopaEndB', notes: '' },
  '378': { id: 378, state: 'CaptureKoopaAirHit', notes: '' },
  '379': { id: 379, state: 'ThrownKoopaAirEndF', notes: '' },
  '380': { id: 380, state: 'ThrownKoopaAirEndB', notes: '' },
  '381': { id: 381, state: 'ThrownKirbyDrinkSShot', notes: '' },
  '382': { id: 382, state: 'ThrownKirbySpitSShot', notes: '' },
};

export { ACTION_STATES };