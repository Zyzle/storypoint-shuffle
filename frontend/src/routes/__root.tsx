import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { SocketProvider } from '../providers/socket.provider';

export const Route = createRootRoute({
  component: () => (
    <SocketProvider>
      <div className="min-h-screen p-8 flex justify-center">
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </SocketProvider>
  ),
});
