import React from 'react';
import { Check, ClipboardCopy, MessageCircleMore } from 'lucide-react';

import { useSocket } from './useSocket';

export const Room: React.FC = () => {
  const { room, me, setMe, revealCards, resetVotes, vote } = useSocket();

  if (!room) return null;

  const players = Object.values(room.players);
  const numPlayers = players.length;
  const votes = room.cards_revealed
    ? Object.values(room.players).map((p) => p.vote)
    : [];
  const averageVote =
    votes.filter((v) => v !== null).reduce((sum, v) => sum + v, 0) /
      votes.length || 0;
  const isHost = me?.id === room.host_id;

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
        You are logged in as <span className="font-semibold">{me?.name}</span>
        {isHost && <span className="text-tertiary-400">(host)</span>}
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
                onClick={() => {
                  if (isHost) {
                    revealCards(room.id);
                  }
                }}
                className="btn preset-filled-secondary-400-600"
              >
                Reveal Cards
              </button>
              <button
                onClick={() => {
                  if (isHost) {
                    resetVotes(room.id);
                  }
                }}
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

          let playerBgColor = '';
          if (room.cards_revealed) {
            playerBgColor = 'bg-tertiary-200';
          } else if (player.has_voted) {
            playerBgColor = 'bg-primary-300';
          } else {
            playerBgColor = 'bg-secondary-200';
          }

          return (
            <div
              key={player.id}
              className={`absolute w-32 h-20 card flex flex-col items-center justify-center text-center p-2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                                    ${
                                      player.id === room.host_id
                                        ? 'border-2 border-success-500'
                                        : ''
                                    }
                                    ${playerBgColor}
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
              {!room.cards_revealed && player.has_voted && <Check size={24} />}
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
                                  me?.vote === voteValue
                                    ? 'bg-success-100 shadow-xl scale-110'
                                    : 'bg-surface-50 shadow-md hover:bg-surface-100'
                                }
                                `}
            onClick={() => {
              setMe((prevMe) => {
                if (prevMe) {
                  return { ...prevMe, vote: voteValue, has_voted: true };
                }
                return prevMe;
              });
              vote(room.id, voteValue);
            }}
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
