import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useOpenSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/socket', {
      autoConnect: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    newSocket.on('connect', () => {
      console.log('OpenChat socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('OpenChat socket connection error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('OpenChat socket disconnected');
    });

    newSocket.on('reconnect', (attemptNumber: number) => {
      console.log('OpenChat socket reconnected after', attemptNumber, 'attempts');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket };
};