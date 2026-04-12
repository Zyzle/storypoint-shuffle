import { Progress } from '@skeletonlabs/skeleton-react';

function Agreement({ modeVotePct }: { modeVotePct: number }) {
  const strokeRange =
    modeVotePct > 75
      ? 'stroke-success-500'
      : modeVotePct > 50
        ? 'stroke-warning-500'
        : 'stroke-error-500';

  const strokeTrack =
    modeVotePct > 75
      ? 'stroke-success-50-950'
      : modeVotePct > 50
        ? 'stroke-warning-50-950'
        : 'stroke-error-50-950';

  return (
    <Progress value={modeVotePct} className="w-fit relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <Progress.ValueText />
      </div>
      <Progress.Circle className="[--size:--spacing(16)]">
        <Progress.CircleTrack className={strokeTrack} />
        <Progress.CircleRange className={strokeRange} />
      </Progress.Circle>
    </Progress>
  );
}

export { Agreement };
