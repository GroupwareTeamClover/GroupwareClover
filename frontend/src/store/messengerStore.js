import { create } from 'zustand';

export const useChatStore = create((set) => ({
  chatRooms: [],
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  addChatRoom: (room) => set((state) => ({ chatRooms: [...state.chatRooms, room] })),
  updateChatRoom: (updatedRoom) => set((state) => ({
    chatRooms: state.chatRooms.map(room => 
      room.roomSeq === updatedRoom.roomSeq ? updatedRoom : room
    )
  })),

  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),

  messages: {},
  addMessage: (roomSeq, message) => set((state) => ({
    messages: {
      ...state.messages,
      [roomSeq]: [...(state.messages[roomSeq] || []), message]
    }
  })),

  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));