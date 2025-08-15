import { AppBar } from '@skeletonlabs/skeleton-react';
import { ArrowLeft, ClipboardCopy } from 'lucide-react';

import { toaster } from '../contexts/toaster.context';

function RoomHeadline({
  roomId,
  playerName,
  isHost,
  exitRoom,
}: {
  roomId: string;
  playerName?: string;
  isHost: boolean;
  exitRoom: () => void;
}) {
  return (
    <AppBar>
      <AppBar.Toolbar>
        <AppBar.ToolbarLead>
          <button className="btn" onClick={exitRoom}>
            <ArrowLeft size={24} />
          </button>
        </AppBar.ToolbarLead>
        <AppBar.ToolbarTrail>
          <button
            className="btn"
            onClick={() => {
              navigator.clipboard.writeText(
                `${import.meta.env.VITE_SITE_URL}/room/${roomId}`,
              );
              toaster.success({ title: 'Room link copied to clipboard' });
            }}
          >
            <ClipboardCopy size={20} />
          </button>
        </AppBar.ToolbarTrail>
      </AppBar.Toolbar>
      <AppBar.Headline>
        <h2 className="h2">
          Room:{' '}
          <span>
            {roomId === '' ? 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' : roomId}
          </span>
        </h2>
        <p>
          You are logged in as{' '}
          <span className="font-semibold">{playerName}</span>&nbsp;(
          <span className={isHost ? 'text-success-300' : 'text-primary-200'}>
            {isHost ? 'host' : 'participant'}
          </span>
          )
        </p>
      </AppBar.Headline>
    </AppBar>
  );
}

export { RoomHeadline };
