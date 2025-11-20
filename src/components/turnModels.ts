export type Player = {
  id: number;
  name: string;
  seat: number;
  color: string;
  faction: SimpleFaction | null;
  strategy: Strategy | null;
  influence: number;
  agenda1votes: number;
  agenda2votes: number;
  speaker: boolean;
  passed: boolean;
};

export type Strategy = {
  name: string;
  color: string;
  initiative: number;
  popped: boolean;
};

export type SimpleFaction = {
  id: number;
  name: string;
};

export type AgendaRow = {
  id: number;
  name: string;
  influence: number;
  agenda1votes: number;
  agenda2votes: number;
  electing1: string;
  electing2: string;
  for1: boolean;
  against1: boolean;
  for2: boolean;
  against2: boolean;
  abstain1: boolean;
  abstain2: boolean;
};

export type VoteFieldGroup = {
  abstain: 'abstain1' | 'abstain2';
  for: 'for1' | 'for2';
  against: 'against1' | 'against2';
  electing: 'electing1' | 'electing2';
  agendaVotes: 'agenda1votes' | 'agenda2votes';
};
