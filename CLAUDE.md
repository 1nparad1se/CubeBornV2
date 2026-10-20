# CubeBorn V2: notes for Claude

Read this before changing the game. It holds the decisions the owner has already made.

## What the game is
- A browser RPG in a Minecraft-like cubic style, built with TypeScript, Three.js and Vite.
- Current stage:
  - a 100×100 test map with three training dummies on a level clearing, in blocky relief (hills, lowlands, mountains; block tops at quarter-block heights);
  - only the Human race;
  - 7 weapons plus a shield, and 3 armor sets (magic, light, heavy) of 4 pieces each;
  - an inventory on Tab or I, a world map on M, a round compass minimap, an empty 6-slot skill bar;
  - a jump instead of a roll, with one double jump in the air;
  - mouse-only control: left click walks / selects / attacks, the right button held orbits and tilts the camera.
- The weapon system: weapon types live in `src/rpg/weapons.ts`; an item only picks a type and its numbers.
- Weapon and armor stats, and how to add a race: [docs/rpg/README.md](docs/rpg/README.md).

## Rules from the owner
- All UI text is in Russian. Reply to the owner in Russian.
- Characters, weapons and armor are strictly Minecraft-style: cubic shapes and pixel textures, with no rounded or realistic models.
- Original assets only, no Mojang assets.
- Do not add classes, skill trees, monsters, quests or a big world until the owner asks. Active skills will come later and are tested on the dummies.
- Planned races are Humans, Orcs, Light Elves, Dark Elves and Dwarves. Only Humans exist; add the others through the race registry in `src/rpg/races.ts`.
- The bow is held level across the chest, with its limbs pointing left and right. The right hand draws the string straight back to the chest.
- Saves must not break. When the save format changes, bump the version and migrate.
- Controls: no walking keys (no WASD). Left click on the ground walks there (pathfinding over the relief); left click on a dummy selects it, a second left click on it starts the auto attack; a ground click stops the attack.
- Camera: the right button held and dragged orbits the hero (full circle) and tilts it between 25° and 50°; it never passes into the terrain.
- Relief: every cell is a flat-topped block at a multiple of 1/4 block; quarter and half steps are walked, a whole block needs a jump.
- Two-handed weapons are held with both hands on the handle (idle, run and attack).
- Maps and the minimap are turned like the camera: up on the screen is up on the map.
- Grass and bushes are decor: no wind (they stand still), they only bend away from the hero, they never block movement.

## Commands
- `npm install`: install dependencies (Node 20+).
- `npm run dev`: start the game at http://localhost:5173.
- `npm test`: equipment, weapon, world, save and clock tests.
- `npm run build`: type-check and build into `dist/`.

## Working together
Two people work on this repo with Claude Code. Pull before starting (`git pull`). Keep commits small, and record new decisions in this file or in docs/rpg/README.md.
