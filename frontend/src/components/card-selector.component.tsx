function CardSelector({
  selectedVote,
  onVoteChange,
}: {
  selectedVote?: number | null;
  onVoteChange: (vote: number) => void;
}) {
  return (
    <div className="flex justify-center flex-wrap gap-4 max-w-4xl">
      {[1, 2, 3, 5, 8, 13, 21].map((voteValue) => (
        <button
          key={voteValue}
          className={`card flex justify-center items-center w-20 h-28 rounded-xl cursor-pointer transition-all duration-200
                                ${
                                  selectedVote === voteValue
                                    ? 'bg-success-100 shadow-xl scale-110'
                                    : 'bg-surface-50 shadow-md hover:bg-surface-100'
                                }
                                `}
          onClick={() => {
            onVoteChange(voteValue);
          }}
        >
          <span className="text-3xl font-bold text-zinc-600">{voteValue}</span>
        </button>
      ))}
    </div>
  );
}

export { CardSelector };
