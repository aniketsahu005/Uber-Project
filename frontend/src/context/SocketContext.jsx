import React, { createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Create the context
export const SocketContext = createContext();

// Only initialize the socket once using useRef (avoids multiple client instances in React StrictMode)
const SocketProvider = ({ children }) => {
  const socketRef = useRef();

  useEffect(() => {
    // Initialize socket connection only if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_BASE_URL);
    }

    // Basic connection logic
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Clean up on unmount to avoid memory leaks
    return () => {
      socketRef.current.off('connect');
      socketRef.current.off('disconnect');
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
