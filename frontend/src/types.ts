import { type Dispatch, type SetStateAction } from 'react';

import type { Placement } from '@floating-ui/react';

export interface DialogOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface Player {
  id: string;
  name: string;
  vote: number | null;
  has_voted: boolean;
  is_spectator: boolean;
}

export interface Room {
  id: string;
  host_id: string;
  players: { [key: string]: Player };
  cards_revealed: boolean;
  card_set: string;
}

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  roomCreated: (room: Room) => void;
  playerJoined: (room: Room) => void;
  roomState: (room: Room) => void;
  playerVoted: (room: Room) => void;
  cardsRevealed: (room: Room) => void;
  votesReset: (room: Room) => void;
  newHostElected: (newHostId: string) => void;
  roomNotFound: () => void;
  playerDisconnected: (room: Room) => void;
  moveToRoom: (roomId: string) => void;
}

export interface ClientToServerEvents {
  createRoom: ({
    name,
    is_spectator,
    card_set,
  }: {
    name: string;
    is_spectator: boolean;
    card_set: string;
  }) => void;
  joinRoom: ({
    room_id,
    name,
    is_spectator,
  }: {
    room_id: string;
    name: string;
    is_spectator: boolean;
  }) => void;
  exitRoom: ({ room_id }: { room_id: string }) => void;
  vote: ({ room_id, vote }: { room_id: string; vote: number }) => void;
  revealCards: ({ room_id }: { room_id: string }) => void;
  resetVotes: ({ room_id }: { room_id: string }) => void;
}

export interface AppState {
  room?: Room;
  me?: Player;
  setMe: Dispatch<SetStateAction<Player | undefined>>;
  error?: string;
  setError: Dispatch<SetStateAction<string | undefined>>;
  joinRoom: (roomId: string, name: string, isSpectator: boolean) => void;
  exitRoom: (roomId: string) => void;
  createRoom: (name: string, isSpectator: boolean, cardSet: string) => void;
  revealCards: (roomId: string) => void;
  resetVotes: (roomId: string) => void;
  vote: (roomId: string, vote: number) => void;
}

export const CardSet: Record<string, Record<string, number>> = {
  fibonacci: { '?': 0, '1': 1, '2': 2, '3': 3, '5': 5, '8': 8, '13': 13 },
  tshirt: { '?': 0, XS: 1, S: 2, M: 3, L: 4, XL: 5, '2XL': 6 },
};

export const Breakpoints = {
  SM: 1,
  MD: 2,
  LG: 4,
  XL: 8,
} as const;

export type Breakpoints = (typeof Breakpoints)[keyof typeof Breakpoints];
