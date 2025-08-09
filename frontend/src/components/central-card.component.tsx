function CentralCard({
  isRevealed,
  showHostControls,
  averageVote,
  onVotesRevealed,
  onVotesReset,
}: {
  isRevealed: boolean;
  showHostControls: boolean;
  averageVote: number;
  onVotesRevealed: () => void;
  onVotesReset: () => void;
}) {
  return (
    <div className="absolute card bg-primary-200 text-primary-contrast-200">
      <div className="flex flex-col items-center justify-center p-6 gap-4">
        <span className="text-xl font-bold">Average Vote</span>
        {isRevealed ? (
          <span className="text-2xl">{averageVote.toFixed(2)}</span>
        ) : (
          <span className="text-2xl">Waiting...</span>
        )}
      </div>
      {/* Host Controls */}
      {showHostControls && (
        <footer className="flex space-x-4 p-2">
          <button
            onClick={onVotesRevealed}
            className="btn preset-filled-secondary-400-600"
          >
            Reveal Cards
          </button>
          <button
            onClick={onVotesReset}
            className="btn preset-filled-error-500"
          >
            Reset Round
          </button>
        </footer>
      )}
    </div>
  );
}

export { CentralCard };
