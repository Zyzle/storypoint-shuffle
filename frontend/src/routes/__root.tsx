import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@skeletonlabs/skeleton-react';

import { SocketProvider } from '../providers/socket.provider';
import { toaster } from '../contexts/toaster.context';

export const Route = createRootRoute({
  component: () => (
    <SocketProvider>
      <Toaster toaster={toaster} />
      <div className="min-h-screen flex justify-center">
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </SocketProvider>
  ),
});
