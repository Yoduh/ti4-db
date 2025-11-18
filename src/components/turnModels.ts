export type Player = {
  id: number;
  name: string;
  seat: number;
  color: string;
  faction: PlayerFaction | null;
  strategy: Strategy | null;
  influence: 0;
  speaker: boolean;
  passed: boolean;
};

export type Strategy = {
  name: string;
  color: string;
  initiative: number;
  popped: boolean;
};

type PlayerFaction = {
  id: number;
  name: string;
};
