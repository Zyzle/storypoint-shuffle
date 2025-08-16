import { Check, MessageCircleMore, Sparkles } from 'lucide-react';

function PlayerCard({
  name,
  isHost,
  vote,
  hasVoted,
  isRevealed,
  color = 'preset-filled-primary-700-300',
  style,
}: {
  name: string;
  isHost: boolean;
  vote?: number | null;
  hasVoted: boolean;
  isRevealed: boolean;
  color: string;
  style?: React.CSSProperties;
}) {
  const icon = hasVoted ? <Check size={30} /> : <MessageCircleMore size={30} />;
  return (
    <div
      className={`${color} absolute w-32 h-20 card flex flex-col items-center justify-between text-center p-2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ring-4`}
      style={style}
    >
      {isHost && (
        <span className="badge-icon preset-filled-success-500 absolute -right-2 -top-2 z-10">
          <Sparkles size={16} />
        </span>
      )}
      <span className="font-bold text-base truncate max-w-28">{name}</span>
      {isRevealed && <span className="text-2xl font-bold">{vote ?? '?'}</span>}
      {!isRevealed && <>{icon}</>}
    </div>
  );
}

export { PlayerCard };
