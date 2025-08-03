import React, { useState, useEffect, useRef } from 'react';
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

  // Ref to hold the socket instance across re-renders
  const socketRef = useRef<Socket | null>(null);

  // Effect hook to set up the Socket.IO connection and event listeners
  useEffect(() => {
    // Connect to the Socket.IO server running on the same host
    const newSocket = io('https://storypoint-shuffle.fly.dev');
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
      <h1 className="text-4xl font-bold">Planning Poker</h1>
      <p className="text-lg text-slate-500">
        Create a new room or join an existing one.
      </p>
      {error && <div className="text-red-500">{error}</div>}

      <div className="card w-full max-w-sm p-6 space-y-4 shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold">Create a Room</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="button" className="btn" onClick={handleCreateRoom}>
          Create Room
        </button>
      </div>

      <div className="card w-full max-w-sm p-6 space-y-4 shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold">Join a Room</h2>
        <input
          type="text"
          placeholder="Room ID"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="button" className="btn" onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );

  // Render the room and game UI
  const renderRoom = () => {
    if (!room) return null;

    // const myId = socketRef.current?.id;
    const votes = room.cards_revealed
      ? Object.values(room.players).map((p) => p.vote)
      : [];
    const averageVote =
      votes.filter((v) => v !== null).reduce((sum, v) => sum + v, 0) /
        votes.length || 0;

    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-8">
        <h1 className="text-4xl font-bold">Room: {room.id}</h1>
        <p>
          You are logged in as <span className="font-semibold">{name}</span>.
        </p>
        {isHost && (
          <p className="text-green-500 font-bold">You are the host.</p>
        )}

        {room.cards_revealed && (
          <div className="text-2xl font-bold">
            Average Vote: {averageVote.toFixed(2)}
          </div>
        )}

        {/* Voting Cards */}
        <div className="flex justify-center flex-wrap gap-4 max-w-4xl">
          {[1, 2, 3, 5, 8, 13].map((voteValue) => (
            <button
              key={voteValue}
              className={`card flex justify-center items-center w-20 h-28 rounded-xl cursor-pointer transition-all duration-200
                                ${
                                  myVote === voteValue
                                    ? 'bg-primary-500 text-white shadow-xl scale-110'
                                    : 'bg-white shadow-md hover:bg-slate-100'
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

        {/* Player List */}
        <div className="w-full max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold">Players</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.values(room.players).map((player) => (
              <div
                key={player.id}
                className={`card p-4 rounded-xl shadow-lg flex flex-col items-center text-center transition-all duration-200
                                    ${
                                      player.id === room.host_id
                                        ? 'border-2 border-green-500'
                                        : ''
                                    }
                                `}
              >
                <span className="font-bold text-xl">{player.name}</span>
                {player.has_voted ? (
                  room.cards_revealed ? (
                    <span className="text-2xl font-bold mt-2">
                      {player.vote}
                    </span>
                  ) : (
                    <span className="text-green-500 mt-2">✅ Voted</span>
                  )
                ) : (
                  <span className="text-red-500 mt-2">Waiting...</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Host Controls */}
        {isHost && (
          <div className="flex space-x-4">
            <button type="button" className="btn" onClick={handleRevealCards}>
              Reveal Cards
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleResetVotes}
            >
              Reset Round
            </button>
          </div>
        )}
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
