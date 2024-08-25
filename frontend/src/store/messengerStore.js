import { create } from 'zustand';
import { toast} from 'react-toastify'
import { sendMessage } from '../commons/websocket';

export const useChatStore = create((set, get) => ({
  // 모든 채팅방 목록
  chatRooms: [],
  
  // 채팅방 목록 전체를 설정하는 함수
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  
  // 새로운 채팅방을 추가하는 함수
  // addChatRoom: (newRoom) => set((state) => ({
  //   chatRooms: [...state.chatRooms, newRoom]
  // })),
  addChatRoom: (newRoom) => set((state) => {
    // 이미 존재하는 채팅방인지 확인
    const existingRoom = state.chatRooms.find(room => room.roomSeq === newRoom.roomSeq);
    if (existingRoom) {
      // 이미 존재하는 경우, 채팅방 정보 업데이트
      return {
        chatRooms: state.chatRooms.map(room => 
          room.roomSeq === newRoom.roomSeq ? { ...room, ...newRoom } : room
        )
      };
    } else {
      // 새로운 채팅방인 경우, 목록에 추가
      return {
        chatRooms: [...state.chatRooms, newRoom]
      };
    }
  }),
  
  // 특정 채팅방 정보를 업데이트하는 함수
  updateChatRoom: (roomSeq, updates) => set(state => ({
    chatRooms: state.chatRooms.map(room =>
      room.roomSeq === roomSeq ? { ...room, ...updates } : room
    )
  })),

  // 현재 선택된 채팅방
  selectedChat: null,
  
  // 선택된 채팅방을 설정하는 함수
  setSelectedChat: (chat) => set({ selectedChat: chat }),

  // 각 채팅방별 메시지 목록
  // 구조: { roomSeq1: [messages], roomSeq2: [messages], ... }
  messages: {},
  addMessage: (roomSeq, message) => set((state) => {
    const currentUserSeq = JSON.parse(sessionStorage.getItem('sessionUser'))?.empSeq;
    const selectedChatRoomSeq = get().selectedChat?.roomSeq;

    console.log('알림 조건:', {
      senderSeq: message.senderSeq,
      currentUserSeq,
      selectedChatRoomSeq,
      messageRoomSeq: roomSeq,
      senderName: message.senderName,  
      senderAvatar: message.senderAvatar  
    });

    if (message.senderSeq !== currentUserSeq && roomSeq !== selectedChatRoomSeq) {
      toast.info(`${message.senderName}: ${message.messageContent}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    return {
      messages: {
        ...state.messages,
        [roomSeq]: [...(state.messages[roomSeq] || []), message]
      }
    };
  }),


  // 각 채팅창별 읽지 않은 메시지 수
  unreadCounts: {},

  // 읽지 않은 메시지 수를 업데이트하는 함수
  setUnreadCounts : (counts) => set({ unreadCounts: counts }),

  // 특정 채팅방의 읽지 않은 메시지 수를 업데이트하는 함수
  // updateUnreadCount: (roomSeq, count) => set((state) => ({
  //   unreadCounts: {
  //    ...state.unreadCounts,
  //     [roomSeq]: count
  //   }
  // })),
  updateUnreadCount: (roomSeq, count) => set((state) => ({
    chatRooms: state.chatRooms.map(room => 
      room.roomSeq === roomSeq ? { ...room, unreadCount: count } : room
    )
  })),

  updateMessageUnreadCount: (roomSeq, messageSeq, unreadCount) => set(state => {
    const roomMessages = state.messages[roomSeq];
    if (!roomMessages) return state; // 메시지가 없으면 상태를 변경하지 않음

    const updatedMessages = roomMessages.map(message =>
      message.messageSeq === messageSeq ? { ...message, unreadCount } : message
    );

    return {
      messages: {
        ...state.messages,
        [roomSeq]: updatedMessages
      }
    };
  }),

  //메시지를 읽음 처리하는 함수
  markMessageAsRead: (roomSeq, lastReadMessageSeq) => set((state) => {
    const roomMessages = state.messages[roomSeq];
    if (!roomMessages) return state; // 메시지가 없으면 상태를 변경하지 않음
  
    const hasUnreadMessages = roomMessages.some(msg => !msg.isRead && msg.messageSeq <= lastReadMessageSeq);
    if (!hasUnreadMessages) return state; // 읽지 않은 메시지가 없으면 상태를 변경하지 않음
  
    // 서버에 읽음 처리 요청 보내기
    sendMessage("/app/chat.readMessages", { roomSeq, lastReadMessageSeq });
  
    const updatedMessages = roomMessages.map(message => ({
      ...message,
      isRead: message.isRead || message.messageSeq <= lastReadMessageSeq
    }));
  
    // 메시지가 변경되었는지 확인
    const messagesChanged = JSON.stringify(roomMessages) !== JSON.stringify(updatedMessages);
  
    if (!messagesChanged) return state; // 메시지가 변경되지 않았다면 상태를 변경하지 않음
  
    return {
      messages: {
        ...state.messages,
        [roomSeq]: updatedMessages
      },
      chatRooms: state.chatRooms.map(room => 
        room.roomSeq === roomSeq ? { ...room, unreadCount: 0 } : room
      )
    };
  }),

  // 특정 채팅방의 모든 메시지 설정 함수( 서버에서 메시지 목록을 받아올 때 사용)
  setMessages: (roomSeq, messages) => set((state) => ({
    messages: {
     ...state.messages,
      [roomSeq]: messages
    }
  })),


    // 현재 온라인 상태인 사용자 목록
    onlineUsers: [],
    
    // 온라인 사용자 목록을 설정하는 함수
    setOnlineUsers: (users) => set({ onlineUsers: users }),

      // 새 공지사항 여부
  hasNewNotice: false,

  // 새 공지사항 상태 설정 함수
  setHasNewNotice: (value) => set({ hasNewNotice: value }),

  // 공지사항 메시지 처리 함수
  handleNoticeMessage: (message) => {
    set({ hasNewNotice: true });
    toast.info(`공지사항: ${message.content}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },


}));