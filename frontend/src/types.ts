export interface Player {
  id: string;
  name: string;
  vote: number | null;
  has_voted: boolean;
}

export interface Room {
  id: string;
  host_id: string;
  players: { [key: string]: Player };
  cards_revealed: boolean;
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
}

export interface ClientToServerEvents {
  createRoom: ({ name }: { name: string }) => void;
  joinRoom: ({ room_id, name }: { room_id: string; name: string }) => void;
  // leaveRoom: () => void;
  vote: ({ room_id, vote }: { room_id: string; vote: number }) => void;
  revealCards: ({ room_id }: { room_id: string }) => void;
  resetVotes: ({ room_id }: { room_id: string }) => void;
}
