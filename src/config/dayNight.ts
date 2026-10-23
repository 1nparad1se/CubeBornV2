/**
 * Day/night cycle configuration (v2.2). Everything that the cycle changes lives here: phase
 * lighting per phase. The phases follow the world clock (see game/GameClock.ts):
 * dawn 05–07, day 07–18, dusk 18–20, night 20–05; 1 real second = 1 game minute.
 */

export type DayPeriod = 'dawn' | 'day' | 'dusk' | 'night';

export interface PhaseLight {
  /** Sun (or moon) intensity multiplier and colour it tints toward. */
  sun: number;
  sunColor: number;
  /** Ambient light multiplier and tint. */
  ambient: number;
  ambientColor: number;
  /** How strongly the tints apply (0 keeps the map palette). */
  tint: number;
  /** Fog distance multiplier (<1 = closer, thicker) and fog colour blend. */
  fog: number;
  fogColor: number;
  fogTint: number;
  /** Colour temperature for the grade pass: + warm, - cold. */
  warm: number;
  /** Saturation multiplier. */
  sat: number;
}

export const DAY_NIGHT = {
  light: {
    // painted, dusky palette (owner): a grey-rose dawn, a muted overcast day, a bruised violet
    // dusk and a dark, cold, eerie night with thick blue-black fog
    dawn: { sun: 0.7, sunColor: 0xd8b294, ambient: 0.78, ambientColor: 0x9aa0b8, tint: 0.45, fog: 0.86, fogColor: 0x8c8890, fogTint: 0.35, warm: 0.02, sat: 0.92 },
    day: { sun: 0.86, sunColor: 0xeae2cc, ambient: 0.86, ambientColor: 0xb4c2c0, tint: 0.25, fog: 0.95, fogColor: 0x96a29c, fogTint: 0.3, warm: 0.0, sat: 0.94 },
    dusk: { sun: 0.55, sunColor: 0xc07454, ambient: 0.6, ambientColor: 0x6a5a82, tint: 0.55, fog: 0.8, fogColor: 0x3a3448, fogTint: 0.45, warm: 0.03, sat: 0.88 },
    // moonlight: a weak cold key light, very dark ambient and a near-black blue fog
    night: { sun: 0.34, sunColor: 0x4a64a8, ambient: 0.44, ambientColor: 0x1e2a50, tint: 0.92, fog: 0.62, fogColor: 0x070b16, fogTint: 0.82, warm: -0.05, sat: 0.72 },
  } as Record<DayPeriod, PhaseLight>,
  /** Maps whose palette is already dark get a softer night (their own lighting carries the mood). */
  darkMapNightStrength: 0.55,

};
