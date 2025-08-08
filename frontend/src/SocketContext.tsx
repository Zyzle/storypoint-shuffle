import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  Room,
  Player,
} from './types';

interface State {
  room?: Room;
  me?: Player;
  setMe: React.Dispatch<React.SetStateAction<Player | undefined>>;
  error?: string;
  joinRoom: (roomId: string, name: string) => void;
  createRoom: (name: string) => void;
  revealCards: (roomId: string) => void;
  resetVotes: (roomId: string) => void;
  vote: (roomId: string, vote: number) => void;
}

const SocketContext = createContext<State | undefined>(undefined);

function SocketProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [me, setMe] = useState<Player | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const joinRoom = useCallback(
    (roomId: string, name: string) => {
      if (socket) {
        setMe({ id: socket.id ?? '', name, vote: null, has_voted: false });
        socket.emit('joinRoom', { room_id: roomId, name });
      }
    },
    [socket]
  );
  const createRoom = useCallback(
    (name: string) => {
      if (socket) {
        setMe({ id: socket.id ?? '', name, vote: null, has_voted: false });
        socket.emit('createRoom', { name });
      }
    },
    [socket]
  );
  const revealCards = useCallback(
    (roomId: string) => {
      if (socket) {
        socket.emit('revealCards', { room_id: roomId });
      }
    },
    [socket]
  );
  const resetVotes = useCallback(
    (roomId: string) => {
      if (socket) {
        socket.emit('resetVotes', { room_id: roomId });
      }
    },
    [socket]
  );
  const vote = useCallback(
    (roomId: string, vote: number) => {
      if (socket) {
        socket.emit('vote', { room_id: roomId, vote });
      }
    },
    [socket]
  );

  const value = useMemo(
    () => ({
      room,
      me,
      setMe,
      error,
      joinRoom,
      createRoom,
      revealCards,
      resetVotes,
      vote,
    }),
    [
      room,
      me,
      setMe,
      error,
      joinRoom,
      createRoom,
      revealCards,
      resetVotes,
      vote,
    ]
  );

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      // 'http://localhost:3333'
      'https://storypoint-shuffle.fly.dev'
    );
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('roomCreated', (room) => {
      setRoom(room);
    });

    socket.on('playerJoined', (room) => {
      setRoom(room);
    });

    socket.on('roomState', (room) => {
      setRoom(room);
    });

    socket.on('playerVoted', (room) => {
      setRoom(room);
    });

    socket.on('cardsRevealed', (room) => {
      setRoom(room);
    });

    socket.on('votesReset', (room) => {
      setMe((prevMe) => {
        if (prevMe) {
          return { ...prevMe, vote: null, has_voted: false };
        }
        return prevMe;
      });
      setRoom(room);
    });

    socket.on('newHostElected', (newHostId) => {
      setMe((prevMe) => {
        if (prevMe && prevMe.id === newHostId) {
          return { ...prevMe, isHost: true };
        }
        return prevMe;
      });
    });

    socket.on('roomNotFound', () => {
      setError('Room not found or invalid ID.');
    });

    socket.on('playerDisconnected', (room) => {
      setRoom(room);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export { SocketProvider, SocketContext };
