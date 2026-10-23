# CubeBorn V2: notes for Claude

Read this before changing the game. It holds the decisions the owner has already made.

## What the game is
- A browser RPG in a Minecraft-like cubic style, built with TypeScript, Three.js and Vite.
- Current stage:
  - the open world «Дикие земли», 2000×2000 blocks (`src/world/wild.ts`): an irregular continent with low rounded mountain ranges (about 50 blocks), gentle hills, rivers, lakes, waterfalls, swamps, climate zones, roads and paths, 18 tree species and 20 bush species; the three training dummies stand on a clearing at the spawn;
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
- Hero and NPCs (Update 6) use the owner's model `Character.blend` (converted by `tools/assets/convert_character.py` into `src/assets/character.*`, 27 bones) in `src/render/human/HumanModel.ts`; NPCs are variants of it (`npcs.ts`: clothes colours, hair, build, armour pieces), never separate models. Weapons are the owner's voxel models from weapons.zip (`tools/assets/convert_weapons.py` → `src/assets/weapons`, `weaponModels.ts`). Animation rules live in `anim.ts` (pure, tested in `tools/tests/human.ts`): facing is independent of movement (legs walk in 8 directions relative to the gaze); combat states peace → drawing → combat → sheathing (sword in a scabbard on the back, bow on the back, staff stays in the hand; never sheathed during an attack); four sword swings in a combo, bow raise/nock/draw/shoot, staff gather/point/release; arms reach the grip by IK. Armour sets for the model: `armorModels.ts` (pieces hide the body parts they cover).
- Targets are chosen only by a left click on an enemy; nothing switches the target on its own; its death or despawn clears it.
- Saves must not break. When the save format changes, bump the version and migrate.
- Controls: no walking keys (no WASD). Left click on the ground walks there (pathfinding over the relief); left click on a dummy selects it, a second left click on it starts the auto attack; a ground click stops the attack.
- Camera: the right button held and dragged orbits the hero (full circle) and tilts it between 25° and 50°; it never passes into the terrain.
- Relief: every cell is a flat-topped block at a multiple of 1/4 block; quarter and half steps are walked, a whole block needs a jump.
- Two-handed weapons are held with both hands on the handle (idle, run and attack).
- Maps and the minimap are turned like the camera: up on the screen is up on the map.
- Grass and bushes are decor: no wind (they stand still), they only bend away from the hero, they never block movement.
- See-through only where it helps: a tree that really stands between the camera and the hero fades to half see-through and back (smoothly); ground that hides the hero (a cliff, a hill) opens a see-through window around the hero only. Nothing else turns see-through. The camera itself never sits inside the ground or a tree crown.
- World generation follows cause and effect: ranges shape the relief, the relief steers the rivers (always downhill to the sea), water and climate (temperature by latitude and height, rain from the west wind with rain shadows) choose biomes, blocks and trees. Keep it that way; `tools/tests/wild.ts` checks it.
- Trees are solid at the trunk (one block); crowns are visual. Near models use 1/6-block leaf and trunk cubes and 1/8-block branch cubes (ragged crowns with gaps, still cubic); keep the species heights. Trees are never one flat colour: the tree material paints a 1/16-block pixel texture (leaves, bark, rings) over the faces. Detail steps down 1/6 → 1/3 → 1/2 → 1 block at 18 / 34 / 56 blocks, all from one shape description.
- Ground blocks live in `src/world/blocks.ts`: the 46 reference blocks plus 10 mixed blocks for the transitions, each a multi-colour pixel pattern. Borders between grounds use the mixed blocks; the choice of block follows cause and effect (rock by slope and range, litter by the tree above it, silt under water).
- Relief stays gentle: ranges about 40–50 blocks over the sea, few whole-block steps (the test checks it).
- Bushes (`src/render/bushModels.ts`): 20 voxel species, mostly very small (0.15) and small (0.3 block), about a third medium (0.5); decor like the grass.
- Roads and paths (`src/world/roads.ts`) join places along the easiest ways with smooth curves; their surface follows the land they cross.
- Fog is a player setting (on/off, density, start); keep distant things fading into it rather than popping.
- Water is a see-through layer over a real bed (`src/render/water.ts`): the deeper, the darker and less see-through. Nine kinds (plain, deep, shallow, rapids, waterfall, calm lake, swamp, sea, frozen); no glossy highlights. Banks never lie below the water beside them.
- Jumps: the hero lands on a block as soon as the feet reach its top; paths may climb one block with a jump and two with a double jump, never more.

## RPG systems (GDD v1.2)
- The spec: [docs/gdd/RPG_AI_Implementation_Package.md](docs/gdd/RPG_AI_Implementation_Package.md); what is built and the chosen parameters: [docs/rpg2/IMPLEMENTATION.md](docs/rpg2/IMPLEMENTATION.md).
- New systems live in `src/rpg2/` and are played on «Тестовая площадка» (main menu), a separate copy of the training meadow; stages follow D202. `?dev=1` shows the dev panel.
- Scale: 1 block = 1 m. The test scene follows D212 (steps up to 0.3 m on foot, jumps 1 m).
- Its save is separate (`cubeborn.rpg2.test`, own format version); controls are stored apart from playthroughs (`cubeborn.controls`).

- One controls rule for the whole game: the RPG test scene (`src/rpg2`, «Тестовая площадка») uses the same mouse controls as above (no WASD, no pointer lock; skills and attacks hit the selected target). Its extra keys: Space jump / air jump, Left Shift dodge toward the cursor, Left Alt toggles sprint (browser Alt action suppressed), Q held blocks / aims / charges, F attacks, E uses the nearest object within 3 m; keys other than the mouse buttons are rebindable. Walkable steps there stay 0.3 m (D212); without a selected target attacks use a 35° cone; Hira's greeting text is accepted. Block, bow aim and staff charge have held cubic poses.

## References
- The owner's reference pictures live in [docs/references/](docs/references/README.md) (ground blocks 1–46, block transitions, winter, forest, desert and swamp plants, swamp and desert trees). Look there before changing ground blocks, textures, plants, trees or biomes, and match their style: small pixel squares, mixed materials blended in ragged pixel patches.

## Commands
- `npm install`: install dependencies (Node 20+).
- `npm run dev`: start the game at http://localhost:5173.
- `npm test`: equipment, weapon, world, save, clock, wild-world and render-model tests.
- `npm run build`: type-check and build into `dist/`.

## Working together
Two people work on this repo with Claude Code. Pull before starting (`git pull`). Keep commits small, and record new decisions in this file or in docs/rpg/README.md.
