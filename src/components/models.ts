export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type NavButton = {
  id: number;
  label: string;
  color: string;
  endpoint?: string;
  disabled: boolean;
  splitBtn: boolean;
};

export type Faction = {
  id: number;
  name: string;
  commodities: number;
  pok: boolean;
  planets: Array<Planet>;
  abilities: Array<Ability>;
  promissory_notes: Array<PromissoryNote>;
  leaders: Array<Leader>;
  factionTech: Array<Technology>;
  startingTech: Array<Technology>;
  startingUnits: Array<StartingUnit>;
  units: Array<Unit>;
};

export type Planet = {
  id: number;
  name: string;
  factionId: number;
  resource: number;
  influence: number;
  trait: string;
  tech: string;
  features: Array<{ name: string }>;
  tile: number;
  faction?: Faction | string;
  notes?: Note[];
};

export type Ability = {
  id: number;
  factionId: number;
  name: string;
  description: string;
  omega: string;
  isOmega: boolean;
  notes?: Note[];
};

export type PromissoryNote = {
  id: number;
  factionId: number;
  name: string;
  description: string;
  omega: string;
  isOmega: boolean;
  pok: boolean;
  notes?: Note[];
};

export type Leader = {
  id: number;
  type: string;
  name: string;
  factionId: number;
  criteria: string;
  effect: string;
  effectName: string;
  omega: string;
  isOmega: boolean;
  leaderId: number;
  notes?: Note[];
};

export type Technology = {
  id: number;
  factionId: number;
  techType: string;
  name: string;
  description: string;
  omega: string;
  isOmega: boolean;
  prereqs: [
    {
      quantity: number;
      techType: string;
    }
  ];
  pok: boolean;
  unitId: number;
  notes?: Note[];
  faction?: { name: string };
  unit?: Unit;
};

export type Unit = {
  id: number;
  type: string;
  subtype: string;
  name: string;
  factionId: number;
  cost: string;
  combat: string;
  move: number;
  capacity: number;
  techUpgradeId: number;
  reinforcementNum: number;
  pok: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: Note[];
  unitAbility: Ability[];
  faction?: Faction | string;
};

export type Note = {
  id: number;
  parentNote: number | null;
  text: string;
  children?: Note[];
};

export interface StartingUnit extends Unit {
  starting_units: { quantity: string };
}

export type Rule = {
  id: number;
  ref: string;
  parentRef: string;
  category: string;
  text: string;
  relevance?: number;
};

export interface RuleNode extends Rule {
  children?: RuleNode[];
}

export type Agenda = {
  id: number;
  name: string;
  type: string;
  elect: boolean;
  effect: string;
  forOption: string;
  againstOption: string;
  baseOnly: boolean;
  pok: boolean;
  notes?: Note[];
};

export type ActionCard = {
  id: number;
  name: string;
  numAvailable: number;
  play: string;
  effect: string;
  flavor: string;
  codex: boolean;
  pok: boolean;
  notes?: Note[];
};

export type StrategyCard = {
  id: number;
  name: string;
  initiative: number;
  primary: string;
  secondary: string;
  overview: string;
  notes?: Note[];
};

export type Objective = {
  id: number;
  name: string;
  type: string;
  condition: string;
  stage: string;
  points: number;
  phase: string;
  pok: boolean;
  isOmega: boolean;
  notes?: Note[];
};

export type ExplorationCard = {
  id: number;
  name: string;
  numAvailable: number;
  effect: string;
  trait: string;
  codex: boolean;
  notes?: Note[];
};

export type Relic = {
  id: number;
  name: string;
  effect: string;
  codex: boolean;
  notes?: Note[];
};
