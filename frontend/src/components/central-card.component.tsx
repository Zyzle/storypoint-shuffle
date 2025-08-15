import { Agreement } from './agreement.component';

function CentralCard({
  isRevealed,
  showHostControls,
  votes,
  onVotesRevealed,
  onVotesReset,
}: {
  isRevealed: boolean;
  showHostControls: boolean;
  votes: number[];
  onVotesRevealed: () => void;
  onVotesReset: () => void;
}) {
  const hasSomeVoted = votes.length > 0;

  const voteCounts = votes.reduce(
    (acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  const modeVote = Object.entries(voteCounts).reduce(
    (acc, [vote, count]) =>
      count > acc.count ? { vote: Number(vote), count } : acc,
    { vote: -1, count: 0 },
  );

  const modePercentage = Math.round((modeVote.count / votes.length) * 100);

  return (
    <div className="absolute card preset-gradient-pt text-primary-contrast-500 min-w-xs shadow-xl">
      <div className="flex flex-col items-center justify-center p-6 gap-4">
        <span className="text-xl font-bold">Results</span>
        {isRevealed ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 place-items-center">
            <span className="text-xl">Mode Vote:</span>
            <span className="text-xl">Agreement:</span>
            <span className="text-2xl">{modeVote.vote}</span>
            <Agreement modeVotePct={modePercentage} />
          </div>
        ) : (
          <span className="text-2xl">Waiting...</span>
        )}
      </div>
      {/* Host Controls */}
      {showHostControls && (
        <footer className="flex space-x-4 p-2 justify-around">
          <button
            onClick={onVotesRevealed}
            className="btn preset-filled-secondary-400-600 shadow-md"
            disabled={!hasSomeVoted || isRevealed}
          >
            Reveal Cards
          </button>
          <button
            onClick={onVotesReset}
            className="btn preset-filled-error-500 shadow-md"
          >
            Reset Round
          </button>
        </footer>
      )}
    </div>
  );
}

export { CentralCard };
