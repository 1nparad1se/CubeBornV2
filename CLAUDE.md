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
- Bow (update 7, owner's reference `docs/references/anim/bow-combat-idle.png`, replaces the old «level across the chest» rule): in combat the bow is upright in the outstretched left hand, the body side-on, an arrow nocked and the right hand drawing the string straight back to the chin; out of combat it hangs upright in the left hand at the side.
- Hero and NPCs (Update 6) use the owner's model `Character.blend` (converted by `tools/assets/convert_character.py` into `src/assets/character.*`, 27 bones) in `src/render/human/HumanModel.ts`; NPCs are variants of it (`npcs.ts`: clothes colours, hair, build, armour pieces), never separate models. Weapons are the owner's voxel models from weapons.zip (`tools/assets/convert_weapons.py` → `src/assets/weapons`, `weaponModels.ts`). Animation rules live in `anim.ts` (pure, tested in `tools/tests/human.ts`): facing is independent of movement (legs walk in 8 directions relative to the gaze); combat states peace → drawing → combat → sheathing; since update 7 every weapon stays in the hand: «Вне боя» held low at the side, «В бою» the stance of the reference sheets `docs/references/anim/*-combat-idle.png` (sword and greatsword raised in both hands, bow drawn, staff leaning out with the free hand forward); the bow's quiver is on the back; four sword swings in a combo, bow raise/nock/draw/shoot, staff gather/point/release; arms reach the grip by IK. Armour sets for the model: `armorModels.ts` (pieces hide the body parts they cover).
- Targets are chosen only by a left click on an enemy; nothing selects or switches the target on its own (no soft lock, no nearest-enemy cone for attacks or skills); its death or despawn clears it. Without a selected target attacks go where the hero faces; spells that need a target refuse with a Russian reason.
- Facing (update 7): the hero turns to the selected target only while an attack, a skill or a held block / aim / charge runs; otherwise he faces the way he walks.
- Reference weapons (update 7, `src/render/human/refWeapons.ts`, voxel cells built in code): sword 1.2 m with a crossguard and a grey blade, greatsword 1.6 m, recurve bow 1.55 m (wood, gold wraps, string), staff 1.9 m (brown shaft, gold rings, glowing cyan crystal, floating cyan pixels in combat). Tier-1 RPG weapons (Железный меч, Железный двуручник, Простой лук, Дорожный посох) and the main game's basic ones use them; keep these sizes against the 1.8 m hero.
- Walk, jumps (update 7): natural gait from `anim.ts legs()` (feet grounded each frame, stride matched to speed); the first jump shows crouch → push → rise → apex → descent → landing squash, the air jump is a forward salto (a full turn around the body's middle, knees tucked, open for landing). Animation only: jump heights and timing stay in `motor.ts` / `config.ts`.
- Hair: the hair shell is separated from the head and ears at load (`coplanar.ts`, no faces within 4 mm of each other) and the character atlas uses mipmaps when small; keep both (the hair shimmered).
- Pose checks: `npm run dev`, then open `/tools/poselab/` (`window.lab`: make, cam, play) for close-ups of poses; not part of the build.
- Saves must not break. When the save format changes, bump the version and migrate.
- Controls: no walking keys (no WASD). Left click on the ground walks there (pathfinding over the relief); left click on a dummy selects it, a second left click on it starts the auto attack; a ground click stops the attack.
- Camera: the right button held and dragged orbits the hero (full circle) and tilts it between 25° and 50°; it never passes into the terrain.
- Relief (owner, update 8; replaces «every cell is a flat-topped block at 1/4 steps»): the ground is one smooth heightfield. `Terrain.buildSmooth` turns the per-cell heights (`top`) into shared corner heights (`vert`, bilinear inside a cell, smooth normals); steep ground is a smooth rock slope (the ground shader paints soil, then stone, by tilt), never a vertical step. Slopes up to 45° are walked (D212), steeper ones are blocked for walking and paths; smooth ground never makes the hero jump. Only cells marked `hard` (test-scene pillars, steps, obstacles) keep a flat top with sheer sides; jumps and falls happen there. Water cells share the same corners, held just under the surface at the banks; bank corners never lie below the water.
- Two-handed weapons are held with both hands on the handle (idle, run and attack).
- Maps and the minimap are turned like the camera: up on the screen is up on the map.
- Grass and bushes are decor: no wind (they stand still), they only bend away from the hero, they never block movement.
- See-through only where it helps: a tree that really stands between the camera and the hero fades to half see-through and back (smoothly); ground that hides the hero (a cliff, a hill) opens a see-through window around the hero only. Nothing else turns see-through. The camera itself never sits inside the ground or a tree crown.
- World generation follows cause and effect: ranges shape the relief, the relief steers the rivers (always downhill to the sea), water and climate (temperature by latitude and height, rain from the west wind with rain shadows) choose biomes, blocks and trees. Keep it that way; `tools/tests/wild.ts` checks it.
- Trees are solid at the trunk (one block); crowns are visual. Near models use 1/6-block leaf and trunk cubes and 1/8-block branch cubes (ragged crowns with gaps, still cubic); keep the species heights. Trees are never one flat colour: the tree material paints a 1/16-block pixel texture (leaves, bark, rings) over the faces. Detail steps down 1/6 → 1/3 → 1/2 → 1 block at 18 / 34 / 56 blocks, all from one shape description.
- Ground blocks live in `src/world/blocks.ts`: the 46 reference blocks plus 10 mixed blocks for the transitions, each a multi-colour pixel pattern. Borders between grounds use the mixed blocks; the choice of block follows cause and effect (rock by slope and range, litter by the tree above it, silt under water).
- Relief stays gentle: ranges about 40–50 blocks over the sea, few slopes steeper than 45°, no step between neighbouring dry cells (the test checks it).
- Bushes (`src/render/bushModels.ts`): 20 voxel species, mostly very small (0.15) and small (0.3 block), about a third medium (0.5); decor like the grass.
- Roads and paths (`src/world/roads.ts`) join places along the easiest ways with smooth curves; their surface follows the land they cross.
- Fog is a player setting (on/off, density, start); keep distant things fading into it rather than popping.
- Water is a see-through layer over a real bed (`src/render/water.ts`): the deeper, the darker and less see-through. Nine kinds (plain, deep, shallow, rapids, waterfall, calm lake, swamp, sea, frozen); no glossy highlights. Banks never lie below the water beside them.
- Jumps: the hero lands as soon as the feet reach the ground; paths may climb a real (hard) step of one block with a jump and two with a double jump, never more; on smooth ground paths never jump.
- Colours (owner, update 8, reference `docs/references/style/muted-colors.png`): a soft, slightly cool, low-saturation look on every quality setting: a CSS grade on the 3D canvas (saturation, contrast, lifted blacks) plus a cool veil (`.grade-tint`), set by «Насыщенность цвета» (default 75 %, 100 % = original colours); grass, moss and water ground textures are toned down in the atlas. The interface is not graded.
- Maps zoom (update 8): the world map (M) zooms with the mouse wheel around the cursor and pans by dragging (double click resets), in the main game and in the test scene.

## RPG systems (GDD v1.2)
- The spec: [docs/gdd/RPG_AI_Implementation_Package.md](docs/gdd/RPG_AI_Implementation_Package.md); what is built and the chosen parameters: [docs/rpg2/IMPLEMENTATION.md](docs/rpg2/IMPLEMENTATION.md).
- New systems live in `src/rpg2/` and are played on «Тестовая площадка» (main menu), a separate copy of the training meadow; stages follow D202. `?dev=1` shows the dev panel.
- Scale: 1 block = 1 m. The test scene walks steps up to 0.5 m smoothly (owner, update 7: overrides D212's 0.3 m; quarter and half blocks never make the hero hop) and jumps 1 m. Only Space jumps; the click walk jumps by itself only at a whole-block rise its path planned as a climb.
- Its save is separate (`cubeborn.rpg2.test`, own format version); controls are stored apart from playthroughs (`cubeborn.controls`).

- One controls rule for the whole game: the RPG test scene (`src/rpg2`, «Тестовая площадка») uses the same mouse controls as above (no WASD, no pointer lock; skills and attacks hit the selected target). Its extra keys: Space jump / air jump, Left Shift dodge toward the cursor, Left Alt toggles sprint (browser Alt action suppressed), Q held blocks / aims / charges, F attacks, E uses the nearest object within 3 m; keys other than the mouse buttons are rebindable. Walkable steps there are 0.5 m (update 7); without a selected target attacks go straight ahead (no cone, no auto-target) and there is no crosshair; Hira's greeting text is accepted. The mentor window there has a training section (+1 уровень, +1000 / +10 000 XP), a testing aid of the test scene. Block, bow aim and staff charge have held cubic poses.

## References
- The owner's reference pictures live in [docs/references/](docs/references/README.md) (ground blocks 1–46, block transitions, winter, forest, desert and swamp plants, swamp and desert trees). Look there before changing ground blocks, textures, plants, trees or biomes, and match their style: small pixel squares, mixed materials blended in ragged pixel patches.

## Commands
- `npm install`: install dependencies (Node 20+).
- `npm run dev`: start the game at http://localhost:5173.
- `npm test`: equipment, weapon, world, save, clock, wild-world and render-model tests.
- `npm run build`: type-check and build into `dist/`.

## Working together
Two people work on this repo with Claude Code. Pull before starting (`git pull`). Keep commits small, and record new decisions in this file or in docs/rpg/README.md.
