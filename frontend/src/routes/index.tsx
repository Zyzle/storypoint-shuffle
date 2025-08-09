import { useState } from 'react';

import { Tabs } from '@skeletonlabs/skeleton-react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { useSocket } from '../hooks/socket.hook';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { error, joinRoom, createRoom } = useSocket();

  const [createJoin, setCreateJoin] = useState('join');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <h1 className="h1">Stroypoint Shuffle</h1>
      <p className="">Create a new room or join an existing one.</p>
      {error && <div className="text-error-500">{error}</div>}

      <Tabs
        value={createJoin}
        onValueChange={(e) => setCreateJoin(e.value)}
        fluid
      >
        <Tabs.List>
          <Tabs.Control value="join">Join Room</Tabs.Control>
          <Tabs.Control value="create">Create Room</Tabs.Control>
        </Tabs.List>
        <Tabs.Content>
          <Tabs.Panel value="join">
            <div className="card w-full max-w-sm p-6 space-y-4 shadow-lg bg-surface-500">
              <h2 className="h3">Join a Room</h2>
              <label className="label">
                <span className="label-text">Room ID</span>
                <input
                  className="input"
                  type="text"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                />
              </label>
              <label className="label">
                <span className="label-text">Name</span>
                <input
                  type="text"
                  className="input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn preset-filled-primary-500"
                onClick={() => joinRoom(roomIdInput, nameInput)}
              >
                <span>Join Room</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="create">
            <div className="card w-full max-w-sm p-6 space-y-4 shadow-lg bg-surface-500">
              <h2 className="h3">Create a Room</h2>
              <label className="label">
                <span className="label-text">Name</span>
                <input
                  type="text"
                  className="input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn preset-filled-primary-500"
                onClick={() => createRoom(nameInput)}
              >
                <span>Create Room</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
