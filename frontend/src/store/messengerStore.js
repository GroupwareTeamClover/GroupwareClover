import { create } from 'zustand';

export const useChatStore = create((set) => ({
  // 모든 채팅방 목록
  chatRooms: [],
  
  // 채팅방 목록 전체를 설정하는 함수
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  
  // 새로운 채팅방을 추가하는 함수
  addChatRoom: (room) => set((state) => ({ chatRooms: [...state.chatRooms, room] })),
  
  // 특정 채팅방 정보를 업데이트하는 함수
  updateChatRoom: (updatedRoom) => set((state) => ({
    chatRooms: state.chatRooms.map(room => 
      room.roomSeq === updatedRoom.roomSeq ? updatedRoom : room
    )
  })),

  // 현재 선택된 채팅방
  selectedChat: null,
  
  // 선택된 채팅방을 설정하는 함수
  setSelectedChat: (chat) => set({ selectedChat: chat }),

  // 각 채팅방별 메시지 목록
  // 구조: { roomSeq1: [messages], roomSeq2: [messages], ... }
  messages: {},
  
  // 특정 채팅방에 새 메시지를 추가하는 함수
  addMessage: (roomSeq, message) => set((state) => ({
    messages: {
      ...state.messages,
      [roomSeq]: [...(state.messages[roomSeq] || []), message]
    }
  })),

  // 각 채팅창별 읽지 않은 메시지 수
  unreadCounts: {},

  // 읽지 않은 메시지 수를 업데이트하는 함수
  setUnreadCounts : (counts) => set({ unreadCounts: counts }),

  // 특정 채팅방의 읽지 않은 메시지 수를 업데이트하는 함수
  updateUnreadCount: (roomSeq, count) => set((state) => ({
    unreadCounts: {
     ...state.unreadCounts,
      [roomSeq]: count
    }
  })),

  //메시지를 읽음 처리하는 함수
  markMessageAsRead: (roomSeq) => set((state) => {
    const updateMessages = state.messages[roomSeq]?.map(message => ({
      ...message,
      isRead:true
    })) || [];

    return {
      messages: {
       ...state.messages,
        [roomSeq]: updateMessages
      },
      unreadCounts: {
       ...state.unreadCounts,
        [roomSeq]: 0
      }
    };
  }),

  // 특정 채팅방의 모든 메시지 설정 함수( 서버에서 메시지 목록을 받아올 때 사용)
  setMessages: (roomSeq, messages) => set((state) => ({
    messages: {
     ...state.messages,
      [roomSeq]: messages
    }
  })),


  // 현재 온라인 상태인 사용자 목록 (현재 비사용)
  onlineUsers: [],
  
  // 온라인 사용자 목록을 설정하는 함수 (현재 비사용)
  setOnlineUsers: (users) => set({ onlineUsers: users }),


}));