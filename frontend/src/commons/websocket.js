import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { BaseUrl } from '../commons/config';

// 전역 변수로 STOMP 클라이언트 객체 선언. 여러 함수에서 접근 가능
let stompClient = null;

// 전역 변수로 STOMP 클라이언트 객체 선언. 여러 함수에서 접근 가능
export const connectWebSocket = (onMessageReceived) => {
  const socket = new SockJS(`${BaseUrl()}/ws`);
  stompClient = Stomp.over(socket); // Stomp 클라이언트 객체 생성. SockJS 소켓을 사용

  // console 디버그 로그 끄기
  // PING과 PONG 메시지를 제외한 로그만 콘솔에 출력
  stompClient.debug = (str) => {
    if (str.indexOf('PING') === -1 && str.indexOf('PONG') === -1) {
        console.log(str);
        } 
    }

// WebSocket 연결 시 사용할 헤더 설정
  const headers = {
    'X-WS-Token': getWsToken() // 서버에서 제공한 wsToken을 가져오는 함수
  };

// STOMP 클라이언트를 사용하여 서버에 연결
stompClient.connect(headers, () => {
    console.log('WebSocket 연결 성공');

    // 공개 채널 구독
    stompClient.subscribe('/topic/public', (payload) => {
      const message = JSON.parse(payload.body);
      onMessageReceived(message);
    });

    // 새 채팅방 생성 알림 구독
    stompClient.subscribe('/topic/newChatRoom', (payload) => {
      console.log('새 채팅방 생성완료');
      const message = JSON.parse(payload.body);
      onMessageReceived({ type: 'NEW_CHAT_ROOM', room: message });
    });

    // 세션 스토리지에서 사용자 정보를 가져옴
    const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    if (sessionUser && sessionUser.empSeq) {
      // 개인 채널 구독. 특정 사용자만을 위한 메시지
      stompClient.subscribe(`/user/${sessionUser.empSeq}/queue/messages`, (payload) => {
        const message = JSON.parse(payload.body);
        onMessageReceived(message);
      });

      // 개인 새 채팅방 알림 구독
      stompClient.subscribe(`/user/${sessionUser.empSeq}/queue/newChatRoom`, (payload) => {
        console.log('1:1 개인 채팅방 생성');
        const message = JSON.parse(payload.body);
        onMessageReceived({ type: 'NEW_CHAT_ROOM', room: message });
      });

      // 그룹 채팅방 생성 알림 구독
      stompClient.subscribe(`/user/${sessionUser.empSeq}/queue/newGroupChatRoom`, (payload) => {
        console.log('그룹 채팅방 생성');
        const message = JSON.parse(payload.body);
        onMessageReceived({ type: 'NEW_CHAT_ROOM', room: message });
      });

      // 타겟 새 채팅방 알림 구독
      stompClient.subscribe(`/user/${sessionUser.empSeq}/queue/targetNewChatRoom`, (payload) => {
        console.log('타겟 1:1 개인 채팅방 생성');
        const message = JSON.parse(payload.body);
        onMessageReceived({ type: 'NEW_CHAT_ROOM', room: message });
      });

    // 온라인 사용자 상태 업데이트 구독 추가
    stompClient.subscribe('/topic/userStatus', (payload) => {
      const message = JSON.parse(payload.body);
      onMessageReceived({ type: 'USER_STATUS', onlineUsers: message });
    });

    stompClient.subscribe('/user/queue/chat', (payload) => {
      const message = JSON.parse(payload.body);
      onMessageReceived(message);
    });

    // 채팅방 목록 업데이트를 위한 새로운 구독 추가
    stompClient.subscribe(`/user/${sessionUser.empSeq}/queue/chatRoomsUpdate`, (payload) => {
      const message = JSON.parse(payload.body);
      onMessageReceived({ type: 'CHAT_ROOMS_UPDATE', rooms: message });
    });    

    // 채팅방 나가기, 대화 내용 삭제, 알림 설정 변경을 위한 구독
    stompClient.subscribe(`/user/${sessionUser.empSeq}/queue/chatRoomUpdates`, (payload) => {
      const message = JSON.parse(payload.body);
      switch (message.type) {
        case 'LEAVE':
          console.log('채팅방 나가기:', message.content);
          onMessageReceived({ type: 'LEAVE_ROOM', ...message });
          break;
        case 'CLEAR':
          console.log('대화 내용 삭제:', message.content);
          onMessageReceived({ type: 'CLEAR_CHAT', ...message });
          break;
        case 'NOTIFICATIONS':
          console.log('알림 설정 변경:', message.content);
          onMessageReceived({ type: 'TOGGLE_NOTIFICATIONS', ...message });
          break;
        default:
          console.log('알 수 없는 채팅방 업데이트:', message);
      }
    });
    }
  }, (error) => {
    console.error('WebSocket 연결 에러:', error);
  });
};

// localStorage에서 wsToken을 가져오는 함수
const getWsToken = () => {
  return localStorage.getItem('wsToken');
};

// WebSocket 연결을 종료하는 함수
export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
};

// 서버로 메시지를 전송하는 함수
export const sendMessage = (destination, message) => {
  if (stompClient && stompClient.connected) {
    // STOMP 클라이언트를 통해 메시지 전송
    // destination: 메시지를 보낼 주소
    // {}: 빈 헤더
    // JSON.stringify(message): 메시지 객체를 JSON 문자열로 변환
    stompClient.send(destination, {}, JSON.stringify(message));
  } else {
    console.error('WebSocket이 연결되어 있지 않습니다.');
  }
};

// 채팅방 구독하는 함수
  // roomSeq: 구독할 채팅방의 roomSeq
  // onMessageReceived: 메시지가 수신될 때 호출할 콜백 함수. 메시지 객체를 인자로 받음
  // 반환: 구독 해제할 함수. unsubscribe()를 호출하면 이 함수를 호출.
  // 로컬 스토리지를 사용하여 구독한 채팅방 목록을 관리합니다.
  // 구독 객체를 반환하여 나중에 구독을 해제할 수 있게 한다.

export const subscribeToRoom = (roomSeq, onMessageReceived) => {
    if (stompClient && stompClient.connected) {
      const subscription = stompClient.subscribe(`/topic/room/${roomSeq}`, (payload) => {
        const message = JSON.parse(payload.body);
        onMessageReceived(message);
      });
  
      // 구독한 채팅방 목록 업데이트
      const subscribedRooms = JSON.parse(localStorage.getItem('subscribedRooms') || '[]');
      if (!subscribedRooms.includes(roomSeq)) {
        subscribedRooms.push(roomSeq);
        localStorage.setItem('subscribedRooms', JSON.stringify(subscribedRooms));
      }
  
      // 구독 해제 함수 반환
      return () => {
        subscription.unsubscribe();
        // 구독 해제 시 로컬 스토리지에서도 제거
        const updatedRooms = subscribedRooms.filter(room => room !== roomSeq);
        localStorage.setItem('subscribedRooms', JSON.stringify(updatedRooms));
      };
    } else {
      console.error('WebSocket이 연결되어 있지 않습니다.');
      return () => {}; // 연결되지 않은 경우 더미 함수 반환
    }
  };

export const leaveRoom = (roomSeq) => {
  sendMessage("/app/chat.leaveRoom", { roomSeq });
};

export const clearChatHistory = (roomSeq) => {
  sendMessage("/app/chat.clearHistory", { roomSeq });
};

export const toggleNotifications = (roomSeq, enabled) => {
  sendMessage("/app/chat.toggleNotifications", { roomSeq, enabled });
};