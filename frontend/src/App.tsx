import React from 'react';

// Define the shape of our data based on the Rust structs
import { Home } from './Home';
import { Room } from './Room';
import { useSocket } from './useSocket';

const App: React.FC = () => {
  const { room } = useSocket();

  return (
    <div className="min-h-screen p-8 flex justify-center">
      {room ? <Room /> : <Home />}
    </div>
  );
};

export default App;
