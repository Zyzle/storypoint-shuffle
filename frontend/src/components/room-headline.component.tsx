import { AppBar } from '@skeletonlabs/skeleton-react';
import { ArrowLeft, ClipboardCopy } from 'lucide-react';

import { toaster } from '../contexts/toaster.context';
import { Lightswitch } from './lightswitch.component';

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
    <AppBar classes="preset-glass-neutral">
      <AppBar.Toolbar>
        <AppBar.ToolbarLead>
          <button className="btn" onClick={exitRoom}>
            <ArrowLeft size={24} />
          </button>
        </AppBar.ToolbarLead>
        <AppBar.ToolbarCenter>
          <h2 className="h4">
            Room:{' '}
            <span>
              {roomId === '' ? 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' : roomId}
            </span>
          </h2>
          <p>
            You are logged in as{' '}
            <span className="font-semibold">{playerName}</span>&nbsp;(
            <span
              className={
                isHost ? 'text-success-700-300' : 'text-primary-800-200'
              }
            >
              {isHost ? 'host' : 'participant'}
            </span>
            )
          </p>
        </AppBar.ToolbarCenter>
        <AppBar.ToolbarTrail>
          <Lightswitch />
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
    </AppBar>
  );
}

export { RoomHeadline };
