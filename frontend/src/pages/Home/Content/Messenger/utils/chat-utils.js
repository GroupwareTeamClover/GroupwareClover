import axios from 'axios';
import { sendMessage } from '../../../../../commons/websocket';
import { useChatStore } from '../../../../../store/messengerStore';
import { BaseUrl } from '../../../../../commons/config';

// 1:1 채팅방 생성 함수
export const createOneOnOneChat = async (targetEmpSeq) => {
  try {
    // 서버에 HTTP 요청을 보내 채팅방 생성
    const response = await axios.post(`${BaseUrl()}/api/chat/rooms`,
      { targetEmpSeq: targetEmpSeq },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const newRoom = response.data;

    // 생성된 채팅방 정보를 WebSocket을 통해 실시간으로 전파
    const message = {
      type: 'CREATE_ONE_ON_ONE_CHAT',
      room: newRoom
    };
    sendMessage("/app/chat.notifyNewChat", message);

    // 로컬 상태 업데이트
    handleChatCreated(newRoom);

    return newRoom;
  } catch (error) {
    console.error('1:1 채팅방 생성 중 오류 발생:', error);
    throw error;
  }
};

// 그룹 채팅방 생성 함수
export const createGroupChat = async (roomName, participants) => {
  try {
    // 서버에 HTTP 요청을 보내 그룹 채팅방 생성
    console.log('그룹 채팅 생성 시도:', { roomName, participants });
    console.log('참가자 seq 목록:', participants.map(p => p.seq));
    const response = await axios.post(`${BaseUrl()}/api/chat/rooms/group`,
      { 
        roomName: roomName,
        participants: participants.map(p => ({
          seq: p.seq,
          avatar: p.avatar
        }))
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const newRoom = response.data;

    // 로컬 상태 업데이트
    handleChatCreated(newRoom);

    return newRoom;
  } catch (error) {
    console.error('그룹 채팅방 생성 중 오류 발생1:', error);
    throw error;
  }
};

// 채팅방 생성 후 로컬 상태 업데이트 함수
export const handleChatCreated = (newRoom) => {
  const { addChatRoom, setSelectedChat } = useChatStore.getState();
  addChatRoom(newRoom);
  setSelectedChat(newRoom);
};