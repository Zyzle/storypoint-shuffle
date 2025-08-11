import { ProgressRing } from '@skeletonlabs/skeleton-react';

function Agreement({ modeVotePct }: { modeVotePct: number }) {
  const strokeColor =
    modeVotePct > 75
      ? 'stroke-success-500'
      : modeVotePct > 50
        ? 'stroke-warning-500'
        : 'stroke-error-500';

  return (
    <ProgressRing
      value={modeVotePct}
      meterStroke={strokeColor}
      max={100}
      showLabel
      size="size-16"
    />
  );
}

export { Agreement };
