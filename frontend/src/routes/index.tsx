import { useEffect, useState } from 'react';

import { Tabs } from '@skeletonlabs/skeleton-react';
import { createFileRoute } from '@tanstack/react-router';

import { useSocket } from '../hooks/socket.hook';
import { Logo } from '../components/logo.component';
import { JoinRoomForm } from '../components/join-room-form.component';
import { CreateRoomForm } from '../components/create-room-form.component';
import { toaster } from '../contexts/toaster.context';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { error, joinRoom, createRoom, setError } = useSocket();

  const [createJoin, setCreateJoin] = useState('create');

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toaster.error({ title: 'Error', description: error });
        setError('');
      }, 0);
    }
  }, [error, setError]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="flex flex-row items-center relative h-[200px]">
        <Logo width={200} height={200} className="absolute -left-24 -z-10" />
        <h1 className="h1">Storypoint Shuffle</h1>
      </div>
      <p className="">Create a new room or join an existing one.</p>

      <Tabs
        value={createJoin}
        onValueChange={(e) => setCreateJoin(e.value)}
        fluid
      >
        <Tabs.List>
          <Tabs.Control value="create">Create Room</Tabs.Control>
          <Tabs.Control value="join">Join Room</Tabs.Control>
        </Tabs.List>
        <Tabs.Content classes="flex justify-center">
          <Tabs.Panel value="join">
            <JoinRoomForm onJoin={joinRoom} />
          </Tabs.Panel>

          <Tabs.Panel value="create">
            <CreateRoomForm onCreate={createRoom} />
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
