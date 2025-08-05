import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from '@skeletonlabs/skeleton-react';
import {
  ArrowRight,
  Check,
  ClipboardCopy,
  MessageCircleMore,
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

// Define the shape of our data based on the Rust structs
interface Player {
  id: string;
  name: string;
  vote: number | null;
  has_voted: boolean;
}

interface Room {
  id: string;
  host_id: string;
  players: { [key: string]: Player };
  cards_revealed: boolean;
}

const App: React.FC = () => {
  // State to manage the application's view
  const [currentView, setCurrentView] = useState<'home' | 'room'>('home');
  // State to hold the current room data
  const [room, setRoom] = useState<Room | null>(null);
  // State for user input
  const [name, setName] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [error, setError] = useState('');
  // State for managing the current player's vote
  const [myVote, setMyVote] = useState<number | null>(null);
  // State to determine if the current user is the room host
  const [isHost, setIsHost] = useState(false);
  const [createJoin, setCreateJoin] = useState('join');

  // Ref to hold the socket instance across re-renders
  const socketRef = useRef<Socket | null>(null);

  // Effect hook to set up the Socket.IO connection and event listeners
  useEffect(() => {
    // Connect to the Socket.IO server running on the same host
    const newSocket = io('https://storypoint-shuffle.fly.dev');
    // const newSocket = io('http://localhost:3333');
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Connected to server with ID:', newSocket.id);
    });

    // Event listener for room creation
    newSocket.on('roomCreated', (payload: Room) => {
      console.log('Room created:', payload);
      setRoom(payload);
      setIsHost(payload.host_id === newSocket.id);
      setCurrentView('room');
      setError('');
    });

    // Event listener for when a player joins
    newSocket.on('playerJoined', (newRoom: Room) => {
      setRoom(newRoom);
      setError('');
    });

    // Event listener for receiving the full room state after joining
    newSocket.on('roomState', (payload: Room) => {
      setRoom(payload);
      setIsHost(payload.host_id === newSocket.id);
      setCurrentView('room');
      setError('');
    });

    // Event listener for when a player votes
    newSocket.on('playerVoted', (newRoom: Room) => {
      setRoom(newRoom);
    });

    // Event listener for when cards are revealed
    newSocket.on('cardsRevealed', (newRoom: Room) => {
      setRoom(newRoom);
    });

    // Event listener for when votes are reset
    newSocket.on('votesReset', (newRoom: Room) => {
      setRoom(newRoom);
      setMyVote(null);
    });

    // Event listener for when a new host is elected
    newSocket.on('newHostElected', (newHostId: string) => {
      // Check if the current user is the new host
      if (socketRef.current?.id === newHostId) {
        setIsHost(true);
      }
    });

    // Event listener for room not found errors
    newSocket.on('roomNotFound', () => {
      setError('Room not found or invalid ID.');
    });

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to handle room creation
  const handleCreateRoom = () => {
    if (name) {
      socketRef.current?.emit('createRoom', { name });
    }
  };

  // Function to handle joining a room
  const handleJoinRoom = () => {
    if (name && roomIdInput) {
      socketRef.current?.emit('joinRoom', { room_id: roomIdInput, name });
    }
  };

  // Function to handle a player's vote
  const handleVote = (vote: number) => {
    if (room) {
      setMyVote(vote);
      socketRef.current?.emit('vote', { room_id: room.id, vote });
    }
  };

  // Function for the host to reveal the cards
  const handleRevealCards = () => {
    if (room && isHost) {
      socketRef.current?.emit('revealCards', { room_id: room.id });
    }
  };

  // Function for the host to reset the round
  const handleResetVotes = () => {
    if (room && isHost) {
      socketRef.current?.emit('resetVotes', { room_id: room.id });
    }
  };

  // Render the home screen with options to create or join a room
  const renderHome = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <h1 className="h1">Stroypoint Shuffle</h1>
      <p className="">Create a new room or join an existing one.</p>
      {error && <div className="text-error-500">{error}</div>}

      <Tabs
        value={createJoin}
        onValueChange={(e) => setCreateJoin(e.value)}
        fluid
      >
        <Tabs.List>
          <Tabs.Control value="join">Join Room</Tabs.Control>
          <Tabs.Control value="create">Create Room</Tabs.Control>
        </Tabs.List>
        <Tabs.Content>
          <Tabs.Panel value="join">
            <div className="card w-full max-w-sm p-6 space-y-4 shadow-lg bg-surface-500">
              <h2 className="h3">Join a Room</h2>
              <label className="label">
                <span className="label-text">Room ID</span>
                <input
                  className="input"
                  type="text"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                />
              </label>
              <label className="label">
                <span className="label-text">Name</span>
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn preset-filled-primary-500"
                onClick={handleJoinRoom}
              >
                <span>Join Room</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="create">
            <div className="card w-full max-w-sm p-6 space-y-4 shadow-lg bg-surface-500">
              <h2 className="h3">Create a Room</h2>
              <label className="label">
                <span className="label-text">Name</span>
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn preset-filled-primary-500"
                onClick={handleCreateRoom}
              >
                <span>Create Room</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </div>
  );

  // Render the room and game UI
  const renderRoom = () => {
    if (!room) return null;

    const players = Object.values(room.players);
    const numPlayers = players.length;
    const votes = room.cards_revealed
      ? Object.values(room.players).map((p) => p.vote)
      : [];
    const averageVote =
      votes.filter((v) => v !== null).reduce((sum, v) => sum + v, 0) /
        votes.length || 0;

    const radius = 250;
    const centerOffset = 250;

    return (
      <div className="flex flex-col items-center justify-between p-8 space-y-8 min-h-screen">
        <div className="flex flex-row items-baseline">
          <h1 className="h1">Room: {room.id.slice(0, 8)}...</h1>
          <button
            className="btn"
            onClick={() => navigator.clipboard.writeText(room.id)}
          >
            <ClipboardCopy size={32} className="text-success-200-800" />
          </button>
        </div>

        <p>
          You are logged in as <span className="font-semibold">{name}</span>.
          {isHost && (
            <span className="text-tertiary-400 font-bold">
              You are the host.
            </span>
          )}
        </p>

        {/* Circular Player Card Layout */}
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
          {/* Central Card for Average Vote */}
          <div className="absolute card bg-primary-200 text-primary-contrast-200">
            <div className="flex flex-col items-center justify-center p-6 gap-4">
              <span className="text-xl font-bold">Average Vote</span>
              {room.cards_revealed && (
                <span className="text-2xl">{averageVote.toFixed(2)}</span>
              )}
              {!room.cards_revealed && (
                <span className="text-2xl">Waiting...</span>
              )}
            </div>
            {/* Host Controls */}
            {isHost && (
              <footer className="flex space-x-4 p-2">
                <button
                  onClick={handleRevealCards}
                  className="btn preset-filled-secondary-400-600"
                >
                  Reveal Cards
                </button>
                <button
                  onClick={handleResetVotes}
                  className="btn preset-filled-error-500"
                >
                  Reset Round
                </button>
              </footer>
            )}
          </div>
          {/* Player Cards positioned in a circle */}
          {players.map((player, index) => {
            // Calculate angle for each player card
            const angle = ((2 * Math.PI) / numPlayers) * index;
            // Calculate x and y coordinates
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <div
                key={player.id}
                className={`absolute w-32 h-20 card flex flex-col items-center justify-center text-center p-2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                                    ${
                                      player.id === room.host_id
                                        ? 'border-2 border-success-500'
                                        : ''
                                    }
                                    ${
                                      room.cards_revealed
                                        ? 'bg-tertiary-200'
                                        : player.has_voted
                                        ? 'bg-primary-300'
                                        : 'bg-secondary-200'
                                    }
                                `}
                style={{
                  left: `${centerOffset + x}px`,
                  top: `${centerOffset + y}px`,
                }}
              >
                <span className="font-bold text-base text-zinc-600">
                  {player.name}
                </span>
                {room.cards_revealed && (
                  <span className="text-2xl font-bold mt-1 text-zinc-600">
                    {player.vote ?? '?'}
                  </span>
                )}
                {!room.cards_revealed && player.has_voted && (
                  <Check size={24} />
                )}
                {!room.cards_revealed && !player.has_voted && (
                  <MessageCircleMore size={24} />
                )}
              </div>
            );
          })}
        </div>

        {/* Voting Cards (below the circular layout) */}
        <div className="flex justify-center flex-wrap gap-4 max-w-4xl">
          {[1, 2, 3, 5, 8, 13, 21].map((voteValue) => (
            <button
              key={voteValue}
              className={`card flex justify-center items-center w-20 h-28 rounded-xl cursor-pointer transition-all duration-200
                                ${
                                  myVote === voteValue
                                    ? 'bg-success-100 shadow-xl scale-110'
                                    : 'bg-surface-50 shadow-md hover:bg-surface-100'
                                }
                                `}
              onClick={() => handleVote(voteValue)}
            >
              <span className="text-3xl font-bold text-zinc-600">
                {voteValue}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 flex justify-center">
      {currentView === 'home' ? renderHome() : renderRoom()}
    </div>
  );
};

export default App;
