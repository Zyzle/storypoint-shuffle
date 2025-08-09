import { useState } from 'react';

import { ArrowRight } from 'lucide-react';

import { Dialog, DialogContent, DialogHeading } from './dialog.component';

function JoinRoom() {
  const [nameInput, setNameInput] = useState('');

  return (
    <Dialog open={true}>
      <DialogContent className="Dialog">
        <DialogHeading>Join room</DialogHeading>
        <label className="label">
          <span className="label-text">Name</span>
          <input
            name="name"
            type="text"
            className="input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </label>
        <button type="button" className="btn preset-filled-primary-500">
          <span>Create Room</span>
          <ArrowRight size={18} />
        </button>
      </DialogContent>
    </Dialog>
  );
}

export { JoinRoom };
