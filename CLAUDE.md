# CubeBorn V2: notes for Claude

Read this before changing the game. It holds the decisions the owner has already made.

## What the game is
- A browser RPG in a Minecraft-like cubic style, built with TypeScript, Three.js and Vite.
- Current stage:
  - a 100×100 test map with three training dummies;
  - only the Human race;
  - 7 weapons plus a shield, and 3 armor sets (magic, light, heavy) of 4 pieces each;
  - an inventory on I;
  - a jump instead of a roll;
  - target selection by clicking.
- Weapon and armor stats, and how to add a race: [docs/rpg/README.md](docs/rpg/README.md).

## Rules from the owner
- All UI text is in Russian. Reply to the owner in Russian.
- Characters, weapons and armor are strictly Minecraft-style: cubic shapes and pixel textures, with no rounded or realistic models.
- Original assets only, no Mojang assets.
- Do not add classes, skill trees, monsters, quests or a big world until the owner asks. Active skills will come later and are tested on the dummies.
- Planned races are Humans, Orcs, Light Elves, Dark Elves and Dwarves. Only Humans exist; add the others through the race registry in `src/rpg/races.ts`.
- The bow is held level across the chest, with its limbs pointing left and right. The right hand draws the string straight back to the chest.
- Saves must not break. When the save format changes, bump the version and migrate.

## Commands
- `npm install`: install dependencies (Node 20+).
- `npm run dev`: start the game at http://localhost:5173.
- `npm test`: equipment, weapon, world, save and clock tests.
- `npm run build`: type-check and build into `dist/`.

## Working together
Two people work on this repo with Claude Code. Pull before starting (`git pull`). Keep commits small, and record new decisions in this file or in docs/rpg/README.md.
