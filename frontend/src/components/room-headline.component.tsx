import { AppBar } from '@skeletonlabs/skeleton-react';
import { ArrowLeft, ClipboardCopy } from 'lucide-react';

import { toaster } from '../contexts/toaster.context';
import { Lightswitch } from './lightswitch.component';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip.component';

function RoomHeadline({
  roomId,
  playerName,
  isHost,
  isSpectator,
  exitRoom,
}: {
  roomId: string;
  playerName?: string;
  isHost: boolean;
  isSpectator: boolean;
  exitRoom: () => void;
}) {
  return (
    <AppBar classes="preset-glass-neutral !py-2 !px-1 md:!py-4 md:!px-2">
      <AppBar.Toolbar classes="">
        <AppBar.ToolbarLead>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="btn px-2 py-1 md:px-4 md:py-2"
                onClick={exitRoom}
                aria-label="Leave room"
              >
                <ArrowLeft size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Leave Room</TooltipContent>
          </Tooltip>
        </AppBar.ToolbarLead>
        <AppBar.ToolbarCenter>
          <h2 className="truncate h4 inline-block md:block max-w-[120px]  md:max-w-full">
            Room:{' '}
            <span className="">
              {roomId === '' ? 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' : roomId}
            </span>
          </h2>
          <p className="text-xs md:text-base">
            You are logged in as{' '}
            <span className="font-semibold">{playerName}</span>&nbsp;(
            <span
              className={
                isHost ? 'text-success-700-300' : 'text-primary-800-200'
              }
            >
              {isHost ? 'host' : isSpectator ? 'spectator' : 'player'}
            </span>
            )
          </p>
        </AppBar.ToolbarCenter>
        <AppBar.ToolbarTrail>
          <Lightswitch className="btn pl-2 pr-0 py-1 md:pl-4 md:py-2" />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Copy room link"
                className="btn px-2 py-1 md:px-4 md:py-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${import.meta.env.VITE_SITE_URL}/room/${roomId}`,
                  );
                  toaster.success({ title: 'Room link copied to clipboard' });
                }}
              >
                <ClipboardCopy size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Copy Room Link</TooltipContent>
          </Tooltip>
        </AppBar.ToolbarTrail>
      </AppBar.Toolbar>
    </AppBar>
  );
}

export { RoomHeadline };
