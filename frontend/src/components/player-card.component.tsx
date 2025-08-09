import { Check, MessageCircleMore } from 'lucide-react';

function PlayerCard({
  name,
  isHost,
  vote,
  hasVoted,
  isRevealed,
  style,
}: {
  name: string;
  isHost: boolean;
  vote?: number | null;
  hasVoted: boolean;
  isRevealed: boolean;
  style?: React.CSSProperties;
}) {
  let playerBgColor = '';
  if (isRevealed) {
    playerBgColor = 'bg-tertiary-200';
  } else if (hasVoted) {
    playerBgColor = 'bg-primary-300';
  } else {
    playerBgColor = 'bg-secondary-200';
  }

  const icon = hasVoted ? <Check size={24} /> : <MessageCircleMore size={24} />;
  return (
    <div
      className={`absolute w-32 h-20 card flex flex-col items-center justify-center text-center p-2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                                    ${
                                      isHost
                                        ? 'border-4 border-success-500'
                                        : ''
                                    }
                                    ${playerBgColor}
                                `}
      style={style}
    >
      <span className="font-bold text-base text-zinc-600">{name}</span>
      {isRevealed && (
        <span className="text-2xl font-bold mt-1 text-zinc-600">
          {vote ?? '?'}
        </span>
      )}
      {!isRevealed && <>{icon}</>}
    </div>
  );
}

export { PlayerCard };
