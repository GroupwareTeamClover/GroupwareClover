import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { BaseUrl } from '../commons/config';

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  const socket = new SockJS(`${BaseUrl()}/ws`);
  stompClient = Stomp.over(socket);

  // console 디버그 로그 끄기
  stompClient.debug = (str) => {
    if (str.indexOf('PING') === -1 && str.indexOf('PONG') === -1) {
        console.log(str);
        } 
    }

  const headers = {
    'X-WS-Token': getWsToken() // 서버에서 제공한 wsToken을 가져오는 함수
  };

  stompClient.connect(headers, () => {
    console.log('WebSocket 연결 성공');
    
    // 공개 채널 구독
    stompClient.subscribe('/topic/public', onMessageReceived);
    
    // 개인 채널 구독
    const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    if (sessionUser && sessionUser.empSeq) {
      stompClient.subscribe(`/user/${sessionUser.empSeq}/queue/messages`, onMessageReceived);
    }

  }, (error) => {
    console.error('WebSocket 연결 에러:', error);
  });
};

const getWsToken = () => {
  // localStorage에서 wsToken을 가져오는 로직
  return localStorage.getItem('wsToken');
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
};

export const sendMessage = (destination, message) => {
  if (stompClient) {
    stompClient.send(destination, {}, JSON.stringify(message));
  }
};