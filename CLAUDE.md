# CubeBorn V2: notes for Claude

Read this before changing the game. It holds the decisions the owner has already made.

## What the game is
- A browser RPG in a Minecraft-like cubic style, built with TypeScript, Three.js and Vite.
- Current stage:
  - the open world «Дикие земли», 2000×2000 blocks (`src/world/wild.ts`): an irregular continent with mountain ranges, rivers, lakes, waterfalls, climate zones and forests of 8 tree species; the three training dummies stand on a clearing at the spawn;
  - the 100×100 training meadow stays for the tests and the menu backdrop;
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
- Do not add classes, skill trees, monsters or quests until the owner asks (the big world was asked for). Active skills will come later and are tested on the dummies.
- Planned races are Humans, Orcs, Light Elves, Dark Elves and Dwarves. Only Humans exist; add the others through the race registry in `src/rpg/races.ts`.
- The bow is held level across the chest, with its limbs pointing left and right. The right hand draws the string straight back to the chest.
- Saves must not break. When the save format changes, bump the version and migrate.
- Controls: no walking keys (no WASD). Left click on the ground walks there (pathfinding over the relief); left click on a dummy selects it, a second left click on it starts the auto attack; a ground click stops the attack.
- Camera: the right button held and dragged orbits the hero (full circle) and tilts it between 25° and 50°; it never passes into the terrain.
- Relief: every cell is a flat-topped block at a multiple of 1/4 block; quarter and half steps are walked, a whole block needs a jump.
- Two-handed weapons are held with both hands on the handle (idle, run and attack).
- Maps and the minimap are turned like the camera: up on the screen is up on the map.
- Grass and bushes are decor: no wind (they stand still), they only bend away from the hero, they never block movement.
- See-through only where it helps: a tree that really stands between the camera and the hero fades to half see-through and back (smoothly); ground that hides the hero (a cliff, a hill) opens a see-through window around the hero only. Nothing else turns see-through. The camera itself never sits inside the ground or a tree crown.
- World generation follows cause and effect: ranges shape the relief, the relief steers the rivers (always downhill to the sea), water and climate (temperature by latitude and height, rain from the west wind with rain shadows) choose biomes, blocks and trees. Keep it that way; `tools/tests/wild.ts` checks it.
- Trees are solid at the trunk (one block); crowns are visual. Near models use 1/6-block leaf and trunk cubes and 1/8-block branch cubes (ragged crowns with gaps, still cubic); keep the species heights. Ground blocks: grass kinds, snow, gravel, clay, basalt, tuff, moss_stone, ice, sandstone, sand, stone.
- Water is a see-through layer over a real bed (`src/render/water.ts`): the deeper, the darker and less see-through. Nine kinds (plain, deep, shallow, rapids, waterfall, calm lake, swamp, sea, frozen); no glossy highlights. Banks never lie below the water beside them.
- Jumps: the hero lands on a block as soon as the feet reach its top; paths may climb one block with a jump and two with a double jump, never more.

## Commands
- `npm install`: install dependencies (Node 20+).
- `npm run dev`: start the game at http://localhost:5173.
- `npm test`: equipment, weapon, world, save, clock, wild-world and render-model tests.
- `npm run build`: type-check and build into `dist/`.

## Working together
Two people work on this repo with Claude Code. Pull before starting (`git pull`). Keep commits small, and record new decisions in this file or in docs/rpg/README.md.
