// Centralized motion tokens derived from 10 extracted design systems
// Sources: refractweb, digitalpresent, lusion, princity, landonorris, missioncontrol, loketdesign, mersi, neverhack, igloo

export const ease = {
  sharpSnap: [0.96, 0, 0.04, 1] as const, // refractweb line-mask reveals
  smoothOut: [0.22, 1, 0.36, 1] as const, // digitalpresent smooth out
  standard: [0.4, 0, 0.2, 1] as const, // lusion primary easing
  expo: [0.16, 1, 0.3, 1] as const, // princity golden-ratio ease
  loket: [0.83, 0, 0.17, 1] as const, // loketdesign clip-path reveals
};

export const dur = {
  fast: 0.3,
  base: 0.5,
  medium: 0.8,
  slow: 1.0,
  reveal: 0.9,
};

export const spring = {
  stiff: { type: 'spring' as const, stiffness: 260, damping: 28 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 15 },
};

export const stagger = {
  chars: 0.04,
  lines: 0.07,
  cards: 0.12,
  sections: 0.15,
};
