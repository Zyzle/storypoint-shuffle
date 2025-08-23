function CardSelector({
  selectedVote,
  cardSet,
  onVoteChange,
}: {
  selectedVote?: number | null;
  cardSet: { [key: string]: number };
  onVoteChange: (vote: number) => void;
}) {
  return (
    <div className="flex justify-center flex-wrap gap-4 max-w-4xl pb-4">
      {Object.entries(cardSet).map(([label, value]) => (
        <button
          key={label}
          className={`card flex justify-center items-center w-20 h-28 rounded-xl cursor-pointer transition-all duration-200
                                ${
                                  selectedVote === value
                                    ? 'card-gradient-selected shadow-xl scale-110'
                                    : 'card-gradient-unselected shadow-md hover:bg-surface-100'
                                }
                                `}
          onClick={() => {
            onVoteChange(value);
          }}
        >
          <span className="text-3xl font-bold text-zinc-600">{label}</span>
        </button>
      ))}
    </div>
  );
}

export { CardSelector };
