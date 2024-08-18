package com.clover.messenger.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.services.ChatRoomService;

import java.util.Map;

@Controller
public class ChatRoomWebSocketController {

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 사용자가 채팅방에 입장할 때 호출되는 메소드 (그룹 채팅방 용)
     * @param chatMessage 채팅방 입장 정보를 포함한 메시지 객체
     * @param headerAccessor WebSocket 세션 정보를 포함한 헤더 접근자
     */
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageDTO chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에서 사용자 ID를 추출
        int empSeq = Integer.parseInt(headerAccessor.getUser().getName());

        // WebSocket 세션에 사용자 ID 저장
        headerAccessor.getSessionAttributes().put("empSeq", empSeq);

        // 사용자를 채팅방에 추가하고 업데이트된 채팅방 정보를 받아옴
        ChatRoomDTO updatedRoom = chatRoomService.addUserToRoom(empSeq, chatMessage.getRoomSeq());

        // 입장 메시지 생성
        ChatMessageDTO joinMessage = new ChatMessageDTO();
        joinMessage.setRoomSeq(chatMessage.getRoomSeq());
        joinMessage.setSenderSeq(empSeq);
        joinMessage.setMessageType("JOIN");
        joinMessage.setMessageContent(empSeq + " 님이 입장하셨습니다.");

        // 채팅방의 모든 사용자에게 새 사용자 입장 메시지와 업데이트된 채팅방 정보를 브로드캐스트
        messagingTemplate.convertAndSend("/topic/room/" + chatMessage.getRoomSeq(), 
            Map.of("joinMessage", joinMessage, "updatedRoom", updatedRoom));
    }

    /**
     * 사용자가 채팅방을 나갈 때 호출되는 메소드
     * @param message 채팅방 퇴장 정보를 포함한 메시지 객체
     */
    @MessageMapping("/chat.leaveRoom")
    public void leaveRoom(@Payload ChatMessageDTO message) {
        // 채팅방을 떠난 사용자 정보를 브로드캐스트
        messagingTemplate.convertAndSend("/topic/room/" + message.getRoomSeq(), 
            new ChatMessageDTO(message.getRoomSeq(), message.getSenderSeq() + "님이 채팅방을 나갔습니다.", "LEAVE"));
    }
    
    /**
     * 채팅방의 대화 내용을 삭제할 때 호출되는 메소드
     * @param message 대화 내용 삭제 정보를 포함한 메시지 객체
     */
    @MessageMapping("/chat.clearHistory")
    public void clearHistory(@Payload ChatMessageDTO message) {
        // 대화 내용 삭제 알림을 브로드캐스트
        messagingTemplate.convertAndSend("/topic/room/" + message.getRoomSeq(), 
            new ChatMessageDTO(message.getRoomSeq(), "대화 내용이 삭제되었습니다.", "CLEAR"));
    }
}
