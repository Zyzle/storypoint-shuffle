import { Agreement } from './agreement.component';

function CentralCard({
  isRevealed,
  showHostControls,
  votes,
  hasSomeVoted,
  cardSet,
  classes,
  onVotesRevealed,
  onVotesReset,
}: {
  isRevealed: boolean;
  showHostControls: boolean;
  votes: number[];
  hasSomeVoted: boolean;
  cardSet: { [key: string]: number };
  classes?: string;
  onVotesRevealed: () => void;
  onVotesReset: () => void;
}) {
  const voteCounts = votes.reduce(
    (acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  const modeVote = Object.entries(voteCounts).reduce(
    (acc, [vote, count]) => {
      if (Number(vote) === 0) return acc;
      return count > acc.count ? { vote: Number(vote), count } : acc;
    },
    { vote: -1, count: 0 },
  );

  const modePercentage = Math.round(
    (modeVote.count / votes.filter((v) => v !== 0).length) * 100,
  );

  return (
    <div
      className={`card preset-gradient-pt text-primary-contrast-500 min-w-xs shadow-xl ${classes}`}
    >
      <div className="flex flex-col items-center justify-center p-3 lg:p-6 gap-2 lg:gap-4">
        <span className="text-xl font-bold">Results</span>
        {isRevealed ? (
          <div className="grid grid-cols-2 gap-x-4 lg:gap-x-8 gap-y-1 lg:gap-y-2 place-items-center">
            <span className="text-xl">Mode Vote:</span>
            <span className="text-xl">Agreement:</span>
            <span className="text-4xl font-bold">
              {modeVote.vote !== -1
                ? Object.keys(cardSet).find(
                    (key) => cardSet[key] === modeVote.vote,
                  )
                : '--'}
            </span>
            {modeVote.vote !== -1 ? (
              <Agreement modeVotePct={modePercentage} />
            ) : (
              <span className="text-4xl font-bold">N/A</span>
            )}
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
            className="btn preset-filled-secondary-500 shadow-md"
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
