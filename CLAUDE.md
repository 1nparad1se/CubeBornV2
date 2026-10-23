# CubeBorn V2: notes for Claude

Read this before changing the game. It holds the decisions the owner has already made.

## What the game is
- A browser RPG built with TypeScript, Three.js and Vite: blocky Minecraft-style characters, weapons and armour in a smooth, painted, dusky world.
- Current stage:
  - the open world «Дикие земли», 2000×2000 blocks (`src/world/wild.ts`): an irregular continent with low rounded mountain ranges (about 50 blocks), gentle hills, rivers, lakes, waterfalls, swamps, climate zones, roads and paths, 18 tree species and 20 bush species; the three training dummies stand on a clearing at the spawn;
  - the 100×100 training meadow stays for the tests and the menu backdrop;
  - only the Human race;
  - 7 weapons plus a shield, and 3 armor sets (magic, light, heavy) of 4 pieces each;
  - an inventory on Tab or I, a world map on M, a round compass minimap, an empty 6-slot skill bar;
  - a jump instead of a roll, with one double jump in the air;
  - the world map (M) zooms with the mouse wheel around the cursor, pans by dragging and resets on a double click;
  - mouse-only control: left click walks / selects / attacks, the right button held orbits and tilts the camera.
- The weapon system: weapon types live in `src/rpg/weapons.ts`; an item only picks a type and its numbers.
- Weapon and armor stats, and how to add a race: [docs/rpg/README.md](docs/rpg/README.md).

## Rules from the owner
- All UI text is in Russian. Reply to the owner in Russian.
- Characters, weapons and armor are strictly Minecraft-style: cubic shapes and pixel textures, with no rounded or realistic models.
- The world is not cubic (owner, smooth world): smooth relief, smooth shores, organic trees, bushes and grass, painted textures. Only characters, weapons and armour stay blocky.
- Look: painted and a little eerie. Muted, darker, desaturated colours, deep shadows, cool grey-green haze and fog, dark water, soft brushed ground; nights darker and spookier. The colour grade (src/render/Renderer.ts, GradeShader) runs on every quality preset (a light one-pass composer without post-processing); the player's «Насыщенность цвета» setting scales its saturation. The UI is not graded.
- Original assets only, no Mojang assets.
- Do not add classes, skill trees, monsters or quests until the owner asks (the big world was asked for). Active skills will come later and are tested on the dummies.
- Planned races are Humans, Orcs, Light Elves, Dark Elves and Dwarves. Only Humans exist; add the others through the race registry in `src/rpg/races.ts`.
- The bow is held level across the chest, with its limbs pointing left and right. The right hand draws the string straight back to the chest.
- Saves must not break. When the save format changes, bump the version and migrate.
- Controls: no walking keys (no WASD). Left click on the ground walks there (pathfinding over the relief); left click on a dummy selects it, a second left click on it starts the auto attack; a ground click stops the attack.
- Camera: the right button held and dragged orbits the hero (full circle) and tilts it between 25° and 50°; it never passes into the terrain.
- Relief: one smooth heightfield (`Terrain.buildSmooth`, one height per cell corner shared by all neighbours, smooth normals); no steps and no vertical cell faces. Slopes up to 45° are walked, steeper ones are blocked; smooth ground never makes the hero jump (only a real sheer step, e.g. the test meadow's obstacles, `Terrain.hard`).
- Two-handed weapons are held with both hands on the handle (idle, run and attack).
- Maps and the minimap are turned like the camera: up on the screen is up on the map.
- Grass and bushes are decor: no wind (they stand still), they only bend away from the hero, they never block movement.
- See-through only where it helps: a tree that really stands between the camera and the hero fades to half see-through and back (smoothly); ground that hides the hero (a cliff, a hill) opens a see-through window around the hero only. Nothing else turns see-through. The camera itself never sits inside the ground or a tree crown.
- World generation follows cause and effect: ranges shape the relief, the relief steers the rivers (always downhill to the sea), water and climate (temperature by latitude and height, rain from the west wind with rain shadows) choose biomes, blocks and trees. Keep it that way; `tools/tests/wild.ts` checks it.
- Trees are solid at the trunk (one block); crowns are visual. Each species is one shape description (trunk boxes, limbs, leaf clumps, conifer cones) drawn as organic low-poly models (`src/render/smoothModels.ts`): round tapering trunks and limbs, lumpy soft leaf clumps, drooping conifer tiers; keep the species heights. Trees are never one flat colour: vertex colours plus soft painted dabs in the tree material. Detail steps down at 18 / 34 / 56 blocks (fewer facets, no twigs), all from the same description; instances turn freely.
- Ground kinds live in `src/world/blocks.ts`: the 46 reference grounds plus 10 mixed ones for the transitions (their colours feed the painted ground). The ground shader paints them softly: each ground's colours blend into its neighbours through a noise-warped, smoothly filtered field, with brush strokes, light and shade washes, worn earth on tilted ground and grey-blue rock on steep ground; no pixel textures and no cell squares. The choice of ground follows cause and effect (rock by slope and range, litter by the tree above it, silt under water).
- Relief stays gentle: ranges about 40–50 blocks over the sea, few slopes steeper than 45° (the test checks it).
- Bushes (`src/render/bushModels.ts`): 20 species sketched in voxels and wrapped into soft rounded shapes (surface nets), mostly very small (0.15) and small (0.3 block), about a third medium (0.5); decor like the grass. Grass and flowers are soft painted sprites (no pixel art).
- Roads and paths (`src/world/roads.ts`) join places along the easiest ways with smooth curves; their surface follows the land they cross.
- Fog is a player setting (on/off, density, start); keep distant things fading into it rather than popping.
- Water is a see-through layer over a real bed (`src/render/water.ts`): the deeper, the darker and less see-through, in dark muted colours. Nine kinds (plain, deep, shallow, rapids, waterfall, calm lake, swamp, sea, frozen); no glossy highlights. Shores are smooth: the waterline is where the smooth ground crosses the water surface (`Terrain.shoreline`), curving through the bank cells, never along cell edges; the water surface slopes smoothly with the river. Every bank cell keeps its middle above the water beside it and never sinks deep under it.
- Jumps: the hero lands on ground as soon as the feet reach it; on the smooth world paths never need a jump. Where a real step exists (test meadow obstacles) paths may climb one block with a jump and two with a double jump, never more.

## References
- The owner's reference pictures live in [docs/references/](docs/references/README.md) (ground blocks 1–46, block transitions, winter, forest, desert and swamp plants, swamp and desert trees). Look there before changing grounds, plants, trees or biomes for their materials and colours; the world now renders them painted and smooth (soft brushed blends instead of pixel squares).

## Commands
- `npm install`: install dependencies (Node 20+).
- `npm run dev`: start the game at http://localhost:5173.
- `npm test`: equipment, weapon, world, save, clock, wild-world and render-model tests.
- `npm run build`: type-check and build into `dist/`.

## Working together
Two people work on this repo with Claude Code. Pull before starting (`git pull`). Keep commits small, and record new decisions in this file or in docs/rpg/README.md.
