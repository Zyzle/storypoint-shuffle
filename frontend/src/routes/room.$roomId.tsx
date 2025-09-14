import { useEffect, useMemo, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Confetti from 'react-confetti';

import { useSocket } from '../hooks/socket.hook';
import { CentralCard } from '../components/central-card.component';
import { PlayerCard } from '../components/player-card.component';
import { CardSelector } from '../components/card-selector.component';
import { RoomHeadline } from '../components/room-headline.component';
import { JoinRoomDialog } from '../components/join-room-dialog.component';
import { Breakpoints, CardSet } from '../types';
import { useBreakpoints } from '../hooks/breakpoints.hook';
import { useElementCenter } from '../hooks/container.hook';

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
  const [showConfetti, setShowConfetti] = useState(false);
  const votes = useMemo(() => {
    return room?.players
      ? Object.values(room.players)
          .filter((p) => !p.is_spectator)
          .map((p) => p.vote ?? 0)
      : [];
  }, [room]);
  const isRevealed = useMemo(
    () => room?.cards_revealed ?? false,
    [room?.cards_revealed],
  );
  const hasSomeVoted = useMemo(
    () =>
      room?.players
        ? Object.values(room.players)
            .filter((p) => !p.is_spectator)
            .some((p) => p.has_voted)
        : false,
    [room?.players],
  );

  const cardSet = useMemo(
    () => (room?.card_set ? CardSet[room.card_set] : CardSet.fibonacci),
    [room?.card_set],
  );

  const size = useBreakpoints();

  const [containerRef, { x: xOffset, y: yOffset }] = useElementCenter();

  useEffect(() => {
    const filteredPlayers = Object.values(room?.players ?? {}).filter(
      (p) => !p.is_spectator && p.vote !== 0,
    );
    const agreement =
      isRevealed && room
        ? filteredPlayers.length > 0 &&
          filteredPlayers.every(
            (p) =>
              p.vote ===
              Object.values(room.players).find(
                (p) => !p.is_spectator && p.vote !== 0,
              )?.vote,
          )
        : false;
    setShowConfetti(agreement);
  }, [room, setShowConfetti, isRevealed]);

  const players = room ? Object.values(room.players) : [];
  const numPlayers = players.length;

  const semiMinorAxis = size > Breakpoints.MD ? 250 : 150;
  const semiMajorAxis = size > Breakpoints.LG ? 350 : 250;

  return (
    <>
      <JoinRoomDialog open={!room} roomId={roomId} onJoin={joinRoom} />
      <div className="flex flex-col items-center justify-between h-screen w-full gap-4">
        <RoomHeadline
          playerName={me?.name}
          roomId={room?.id ?? ''}
          isHost={isHost}
          isSpectator={me?.is_spectator ?? false}
          exitRoom={() => {
            if (room && me) {
              exitRoom(room.id);
              navigate({ to: '/' });
            }
          }}
        />

        {/* Circular Player Card Layout */}
        <div
          ref={containerRef}
          className="md:relative w-full h-full flex flex-col md:items-center md:justify-center gap-2 overflow-y-scroll"
        >
          {/* Central Card for Average Vote */}
          <CentralCard
            classes="md:absolute"
            isRevealed={isRevealed}
            showHostControls={isHost}
            votes={votes}
            hasSomeVoted={hasSomeVoted}
            cardSet={cardSet}
            onVotesRevealed={() => revealCards(room?.id ?? '')}
            onVotesReset={() => resetVotes(room?.id ?? '')}
          />
          {/* Player Cards positioned in a circle */}
          {players.map((player, index) => {
            // Calculate angle for each player card
            const angle = ((2 * Math.PI) / numPlayers) * index;
            // Calculate x and y coordinates
            const x = semiMajorAxis * Math.cos(angle);
            const y = semiMinorAxis * Math.sin(angle);

            return (
              <PlayerCard
                classes="md:absolute"
                key={player.id}
                name={player.name}
                isHost={player.id === room?.host_id}
                hasVoted={player.has_voted}
                isRevealed={room?.cards_revealed ?? false}
                style={{
                  left: size > Breakpoints.MD ? `${xOffset + x}px` : undefined,
                  top: size > Breakpoints.MD ? `${yOffset + y}px` : undefined,
                }}
                vote={Object.keys(cardSet).find(
                  (key) => cardSet[key] === player.vote,
                )}
                color={COLORS[Math.abs(hash(player.id)) % COLORS.length]}
                isSpectator={player.is_spectator}
              />
            );
          })}
        </div>

        {/* Voting Cards (below the circular layout) */}
        {!me?.is_spectator ? (
          <CardSelector
            selectedVote={me?.vote}
            cardSet={cardSet}
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
        ) : (
          <div className="hidden md:block h-24" />
        )}
      </div>
      <Confetti
        numberOfPieces={showConfetti ? 500 : 0}
        recycle={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onConfettiComplete={(confetti: any) => {
          setShowConfetti(false);
          confetti.reset();
        }}
      />
    </>
  );
}
