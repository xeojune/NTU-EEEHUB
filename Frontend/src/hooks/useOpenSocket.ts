import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useOpenSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/socket', {
      autoConnect: true,
      transports: ['websocket'],
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

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket };
};