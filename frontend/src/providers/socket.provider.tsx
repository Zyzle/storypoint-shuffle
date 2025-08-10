import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { io, type Socket } from 'socket.io-client';

import type {
  ClientToServerEvents,
  Player,
  Room,
  ServerToClientEvents,
} from '../types';
import { SocketContext } from '../contexts/socket.context';

function SocketProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const navigate = useNavigate();
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
    [socket],
  );
  const createRoom = useCallback(
    (name: string) => {
      if (socket) {
        setMe({ id: socket.id ?? '', name, vote: null, has_voted: false });
        socket.emit('createRoom', { name });
      }
    },
    [socket],
  );
  const revealCards = useCallback(
    (roomId: string) => {
      if (socket) {
        socket.emit('revealCards', { room_id: roomId });
      }
    },
    [socket],
  );
  const resetVotes = useCallback(
    (roomId: string) => {
      if (socket) {
        socket.emit('resetVotes', { room_id: roomId });
      }
    },
    [socket],
  );
  const vote = useCallback(
    (roomId: string, vote: number) => {
      if (socket) {
        socket.emit('vote', { room_id: roomId, vote });
      }
    },
    [socket],
  );
  const exitRoom = useCallback(
    (roomId: string, playerId: string) => {
      if (socket) {
        socket.emit('exitRoom', { room_id: roomId, player_id: playerId });
      }
    },
    [socket],
  );

  const value = useMemo(
    () => ({
      room,
      me,
      setMe,
      error,
      joinRoom,
      exitRoom,
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
      exitRoom,
      createRoom,
      revealCards,
      resetVotes,
      vote,
    ],
  );

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      import.meta.env.VITE_SOCKET_URL,
    );
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('roomCreated', (room) => {
      setRoom(room);
      navigate({
        to: '/room/$roomId',
        params: { roomId: room.id },
      });
    });

    socket.on('playerJoined', (room) => {
      setRoom(room);
    });

    socket.on('roomState', (room) => {
      setRoom(room);
      navigate({
        to: '/room/$roomId',
        params: { roomId: room.id },
      });
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
      setRoom((prevRoom) => {
        if (prevRoom) {
          return { ...prevRoom, host_id: newHostId };
        }
        return prevRoom;
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
  }, [navigate]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export { SocketProvider };
