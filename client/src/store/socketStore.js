import { create } from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin.replace(':5173', ':5000');

const useSocketStore = create((set, get) => ({
  socket: null,

  connect: () => {
    if (get().socket) return get().socket;
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    set({ socket });
    return socket;
  },

  joinAdminRoom: () => {
    const socket = get().socket || get().connect();
    socket.emit('join_admin');
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useSocketStore;
