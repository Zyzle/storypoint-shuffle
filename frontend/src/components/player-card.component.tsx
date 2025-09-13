import { Binoculars, Check, MessageCircleMore, Sparkles } from 'lucide-react';

function PlayerCard({
  name,
  isHost,
  vote,
  hasVoted,
  isRevealed,
  color = 'preset-filled-primary-700-300',
  isSpectator,
  classes,
  style,
}: {
  name: string;
  isHost: boolean;
  vote?: string;
  hasVoted: boolean;
  isRevealed: boolean;
  color: string;
  isSpectator: boolean;
  classes?: string;
  style?: React.CSSProperties;
}) {
  const icon = isSpectator ? (
    <Binoculars size={30} />
  ) : hasVoted ? (
    <Check size={30} />
  ) : (
    <MessageCircleMore size={30} />
  );
  return (
    <div
      className={`${color} md:w-32 md:h-20 card flex flex-col items-center justify-between text-center p-2 transform md:-translate-x-1/2 md:-translate-y-1/2 transition-all duration-300 ring-4 ${classes}`}
      style={style}
    >
      {isHost && (
        <span className="hidden md:flex badge-icon preset-filled-success-500 md:absolute md:-right-2 md:-top-2 z-10">
          <Sparkles size={16} />
        </span>
      )}
      <span
        className={`font-bold text-base truncate max-w-28 ${isHost ? 'underline md:no-underline' : ''}`}
      >
        {name}
      </span>
      {isRevealed && !isSpectator && (
        <span className="text-2xl font-bold line-clamp-1">{vote ?? '?'}</span>
      )}
      {(!isRevealed || isSpectator) && <>{icon}</>}
    </div>
  );
}

export { PlayerCard };
