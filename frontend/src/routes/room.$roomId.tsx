import { createFileRoute } from '@tanstack/react-router';

import { useSocket } from '../hooks/socket.hook';
import { CentralCard } from '../components/central-card.component';
import { PlayerCard } from '../components/player-card.component';
import { CardSelector } from '../components/card-selector.component';
import { RoomHeadline } from '../components/room-headline.component';

export const Route = createFileRoute('/room/$roomId')({
  component: Room,
});

function Room() {
  const { room, me, setMe, revealCards, resetVotes, vote } = useSocket();
  const { roomId } = Route.useParams();

  console.log('Room component rendered with roomId:', roomId);
  console.log('Current room state:', room);

  if (!room || !roomId) return null;

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
    <div className="flex flex-col items-center justify-between min-h-screen">
      <RoomHeadline playerName={me?.name} roomId={room.id} isHost={isHost} />

      {/* Circular Player Card Layout */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center">
        {/* Central Card for Average Vote */}
        <CentralCard
          isRevealed={room.cards_revealed}
          showHostControls={isHost}
          averageVote={averageVote}
          onVotesRevealed={() => revealCards(room.id)}
          onVotesReset={() => resetVotes(room.id)}
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
              isHost={player.id === room.host_id}
              hasVoted={player.has_voted}
              isRevealed={room.cards_revealed}
              style={{
                left: `${centerOffset + x}px`,
                top: `${centerOffset + y}px`,
              }}
              vote={player.vote}
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
          vote(room.id, selectedVote);
        }}
      />
    </div>
  );
}
