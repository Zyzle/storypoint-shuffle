import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useSocket } from '../hooks/socket.hook';
import { CentralCard } from '../components/central-card.component';
import { PlayerCard } from '../components/player-card.component';
import { CardSelector } from '../components/card-selector.component';
import { RoomHeadline } from '../components/room-headline.component';
import { JoinRoomDialog } from '../components/join-room-dialog.component';
import { useMemo } from 'react';

const COLORS = [
  'player-gradient-1',
  'player-gradient-2',
  'player-gradient-3',
  'player-gradient-4',
  'player-gradient-5',
  'player-gradient-6',
];

function hash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export const Route = createFileRoute('/room/$roomId')({
  component: Room,
});

function Room() {
  const { room, me, setMe, revealCards, resetVotes, vote, joinRoom, exitRoom } =
    useSocket();
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const isHost = useMemo(() => me?.id === room?.host_id, [me, room]);

  const players = room ? Object.values(room.players) : [];
  const numPlayers = players.length;
  const votes = room?.cards_revealed
    ? Object.values(room.players)
        .map((p) => p.vote)
        .filter((x) => x !== null)
    : [];

  const radius = 250;
  const centerOffset = 250;

  return (
    <>
      <JoinRoomDialog open={!room} roomId={roomId} onJoin={joinRoom} />
      <div className="flex flex-col items-center justify-between min-h-screen w-full">
        <RoomHeadline
          playerName={me?.name}
          roomId={room?.id ?? ''}
          isHost={isHost}
          exitRoom={() => {
            if (room && me) {
              exitRoom(room.id, me.id);
              navigate({ to: '/' });
            }
          }}
        />

        {/* Circular Player Card Layout */}
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
          {/* Central Card for Average Vote */}
          <CentralCard
            isRevealed={room?.cards_revealed ?? false}
            showHostControls={isHost}
            votes={votes}
            onVotesRevealed={() => revealCards(room?.id ?? '')}
            onVotesReset={() => resetVotes(room?.id ?? '')}
          />
          {/* Player Cards positioned in a circle */}
          {players.map((player, index) => {
            // Calculate angle for each player card
            const angle = ((2 * Math.PI) / numPlayers) * index;
            // Calculate x and y coordinates
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <PlayerCard
                key={player.id}
                name={player.name}
                isHost={player.id === room?.host_id}
                hasVoted={player.has_voted}
                isRevealed={room?.cards_revealed ?? false}
                style={{
                  left: `${centerOffset + x}px`,
                  top: `${centerOffset + y}px`,
                }}
                vote={player.vote}
                color={COLORS[Math.abs(hash(player.id)) % COLORS.length]}
              />
            );
          })}
        </div>

        {/* Voting Cards (below the circular layout) */}
        <CardSelector
          selectedVote={me?.vote}
          onVoteChange={(selectedVote) => {
            setMe((prevMe) => {
              if (prevMe) {
                return { ...prevMe, vote: selectedVote, has_voted: true };
              }
              return prevMe;
            });
            vote(room?.id ?? '', selectedVote);
          }}
        />
      </div>
    </>
  );
}
