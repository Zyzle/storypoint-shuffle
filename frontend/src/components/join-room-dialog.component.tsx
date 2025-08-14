import { Dialog, DialogContent } from './dialog.component';
import { JoinRoomForm } from './join-room-form.component';

function JoinRoomDialog({
  open,
  roomId,
  onJoin,
}: {
  open: boolean;
  roomId: string;
  onJoin: (roomId: string, name: string) => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="Dialog">
        <JoinRoomForm room={roomId} onJoin={onJoin} />
      </DialogContent>
    </Dialog>
  );
}

export { JoinRoomDialog };
