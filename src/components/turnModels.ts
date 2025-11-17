export type Player = {
  id: number;
  name: string;
  color: string;
  faction: PlayerFaction | null;
  strategy: Strategy | null;
  speaker: boolean;
  seat: number;
};

export type Strategy = {
  name: string;
  order: number;
};

type PlayerFaction = {
  id: number;
  name: string;
};
