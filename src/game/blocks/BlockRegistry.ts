/** Block definitions are data; the voxel store and mining rules do not depend on concrete IDs. */
export type ToolKind = 'pickaxe' | 'axe' | 'shovel' | 'hoe';
export interface BlockDefinition {
  id: string;
  name: string;
  category: 'ground' | 'stone' | 'wood' | 'ore' | 'building' | 'utility';
  /** Time in seconds when mined by hand. */
  handSeconds: number;
  /** Time in seconds with a wooden tool of the correct kind. */
  toolSeconds: number;
  tool?: ToolKind;
  minimumTier?: number;
  drop: string | null;
  solid: boolean;
  transparent: boolean;
  replaceable: boolean;
  gravity: boolean;
  stackSize: number;
}

export interface ToolDefinition { kind: ToolKind; tier: number; speed: number; durability: number }
const block = (id: string, name: string, category: BlockDefinition['category'], handSeconds: number, toolSeconds: number, tool?: ToolKind, options: Partial<BlockDefinition> = {}): BlockDefinition => ({
  id, name, category, handSeconds, toolSeconds, tool, drop: id, solid: true, transparent: false, replaceable: false, gravity: false, stackSize: 64, ...options,
});

/** Existing terrain IDs are preserved verbatim so generation and rendering can share them. */
export const BLOCKS: readonly BlockDefinition[] = [
  block('dirt', 'Земля', 'ground', .8, .25, 'shovel'),
  ...['grass','grass2','grass_lush','grass_sun','grass_dry','grass_clover','grass_cold'].map(id => block(id, 'Травяной блок', 'ground', .8, .25, 'shovel', {drop:'dirt'})),
  block('sand', 'Песок', 'ground', .7, .2, 'shovel', {gravity:true}),
  block('gravel', 'Гравий', 'ground', .8, .25, 'shovel', {gravity:true}),
  block('clay', 'Глина', 'ground', .8, .25, 'shovel'),
  block('snow', 'Снег', 'ground', .6, .2, 'shovel'),
  block('ice', 'Лёд', 'ground', 1.5, .6, 'pickaxe', {transparent:true}),
  ...[['stone','Камень'],['basalt','Базальт'],['tuff','Туф'],['moss_stone','Замшелый камень'],['sandstone','Песчаник'],['cobblestone','Булыжник'],['granite','Гранит'],['andesite','Андезит'],['diorite','Диорит']].map(([id,name])=>block(id,name,'stone',8,1.2,'pickaxe')),
  ...[['oak_log','Дубовое бревно'],['birch_log','Берёзовое бревно'],['spruce_log','Еловое бревно'],['pine_log','Сосновое бревно'],['planks','Доски']].map(([id,name])=>block(id,name,'wood',3,.8,'axe')),
  ...[['coal_ore','Угольная руда',1],['copper_ore','Медная руда',2],['iron_ore','Железная руда',2],['gold_ore','Золотая руда',3],['diamond_ore','Алмазная руда',3]].map(([id,name,tier])=>block(id as string,name as string,'ore',12,2,'pickaxe',{minimumTier:tier as number})),
  block('glass','Стекло','building',.5,.5,undefined,{transparent:true}),
  block('workbench','Верстак','utility',3,.8,'axe'),
  block('furnace','Печь','utility',8,1.2,'pickaxe'),
  block('chest','Сундук','utility',3,.8,'axe'),
];

export const BLOCK_BY_ID: ReadonlyMap<string, BlockDefinition> = new Map(BLOCKS.map(b=>[b.id,b]));

/** Insufficient tiers may break a block, but never yield its valuable drop. */
export function miningResult(def: BlockDefinition, tool: ToolDefinition | null): { seconds: number; drop: string | null } {
  const proper = !!tool && tool.kind === def.tool && tool.durability > 0;
  const speed = proper ? Math.max(.01, tool.speed) : 1;
  const seconds = proper ? def.toolSeconds / speed : def.handSeconds;
  const eligible = !def.minimumTier || (proper && tool.tier >= def.minimumTier);
  return { seconds, drop: eligible ? def.drop : null };
}
