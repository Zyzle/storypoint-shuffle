import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toast } from '@skeletonlabs/skeleton-react';

import { SocketProvider } from '../providers/socket.provider';
import { toaster } from '../contexts/toaster.context';

export const Route = createRootRoute({
  component: () => (
    <SocketProvider>
      <Toast.Group toaster={toaster}>
        {(toast) => (
          <Toast toast={toast} key={toast.id}>
            <Toast.Message>
              <Toast.Title>{toast.title}</Toast.Title>
              <Toast.Description>{toast.description}</Toast.Description>
            </Toast.Message>
            <Toast.CloseTrigger />
          </Toast>
        )}
      </Toast.Group>
      <div className="h-screen flex justify-center w-full">
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </SocketProvider>
  ),
});
