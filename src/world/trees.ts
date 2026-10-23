/**
 * Tree species of the wild world. The generator places them (by biome, moisture, height and
 * nearby water) and makes their trunk cells solid; the renderer builds one blocky model per
 * species and variant from the same numbers, so a tree is as tall as the world thinks it is.
 */
export const TREE = {
  oak: 0,
  spruce: 1,
  birch: 2,
  willow: 3,
  dead: 4,
  fruit: 5,
  small: 6,
  pine: 7,
  // deserts and dry plains
  joshua: 8,
  ironwood: 9,
  paloVerde: 10,
  doumPalm: 11,
  quiver: 12,
  // swamps and wet woods
  cypress: 13,
  mangrove: 14,
  tupelo: 15,
  mossy: 16,
  swampWillow: 17,
} as const;

export const TREE_KINDS = 18;
/** Shape variants per species (height, trunk and crown differ); instances add scale and turn. */
export const TREE_VARIANTS = 4;

interface TreeSpec {
  name: string;
  /** Total height (blocks) of variant 0 and the extra per variant step. */
  height: number;
  heightStep: number;
  /** Trunk thickness in model voxels (a voxel is half a block). */
  trunk: number;
}

export const TREE_SPECS: TreeSpec[] = [
  { name: 'Дуб', height: 6.5, heightStep: 0.5, trunk: 2 },
  { name: 'Ель', height: 8.5, heightStep: 1, trunk: 1 },
  { name: 'Берёза', height: 6.5, heightStep: 0.6, trunk: 1 },
  { name: 'Ива', height: 6, heightStep: 0.4, trunk: 2 },
  { name: 'Сухое дерево', height: 4.5, heightStep: 0.6, trunk: 1 },
  { name: 'Фруктовое дерево', height: 4, heightStep: 0.35, trunk: 1 },
  { name: 'Небольшое дерево', height: 2.8, heightStep: 0.35, trunk: 1 },
  { name: 'Сосна обыкновенная высокая', height: 12, heightStep: 1.3, trunk: 1 },
  { name: 'Дерево Джошуа', height: 5, heightStep: 0.5, trunk: 1 },
  { name: 'Железное дерево', height: 4.5, heightStep: 0.4, trunk: 1 },
  { name: 'Пало-верде', height: 4.5, heightStep: 0.4, trunk: 1 },
  { name: 'Ветвистая пальма дум', height: 7, heightStep: 0.8, trunk: 1 },
  { name: 'Колчанное дерево', height: 4.2, heightStep: 0.25, trunk: 2 },
  { name: 'Болотный кипарис', height: 9, heightStep: 1, trunk: 2 },
  { name: 'Мангровое дерево', height: 5.5, heightStep: 0.5, trunk: 1 },
  { name: 'Болотный тупело', height: 7.5, heightStep: 0.7, trunk: 2 },
  { name: 'Дерево со свисающим мхом', height: 7, heightStep: 0.6, trunk: 2 },
  { name: 'Болотная ива', height: 5.5, heightStep: 0.5, trunk: 2 },
];

/** Height (blocks) of a species' variant before the instance scale. */
export function treeHeight(kind: number, variant: number): number {
  const s = TREE_SPECS[kind];
  return s.height + s.heightStep * variant;
}

/** Trees of a world, sorted by 32-block chunk (chunkStart[c] .. chunkStart[c + 1]). */
export interface TreeList {
  count: number;
  x: Float32Array;
  z: Float32Array;
  /** Ground height under the trunk. */
  y: Float32Array;
  kind: Uint8Array;
  variant: Uint8Array;
  /** Quarter turns (0..3). */
  turn: Uint8Array;
  scale: Float32Array;
  /** Chunk grid: TREE_CHUNK blocks per side, `per` chunks per row. */
  per: number;
  chunkStart: Int32Array;
}

export const TREE_CHUNK = 32;
