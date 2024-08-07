package com.clover.messenger.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.dto.ReadMessageDTO;
import com.clover.messenger.services.ChatService;

@Controller
public class ChatWebSocketController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 채팅 메시지 전송을 처리하는 메소드
     * @param chatMessage 클라이언트로부터 받은 채팅 메시지 데이터
     * @param headerAccessor WebSocket 세션 정보를 포함한 헤더 접근자
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDTO chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에서 사용자 ID를 추출
        Integer senderSeq = Integer.parseInt(headerAccessor.getUser().getName());
        chatMessage.setSenderSeq(senderSeq);

        // 메시지를 저장하고 저장된 메시지 객체를 받아옴
        ChatMessageDTO savedMessage = chatService.saveMessage(chatMessage);

        // 채팅 유형에 따라 메시지 전송 방식을 다르게 처리
        if ("private".equals(chatMessage.getRoomType())) {
            // 개인 채팅인 경우, 발신자와 수신자에게 각각 메시지 전송
            messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getReceiverSeq()),
                "/queue/messages",
                savedMessage
            );
            messagingTemplate.convertAndSendToUser(
                String.valueOf(senderSeq),
                "/queue/messages",
                savedMessage
            );
        } else {
            // 그룹 채팅인 경우, 해당 채팅방의 모든 사용자에게 메시지 브로드캐스트
            messagingTemplate.convertAndSend("/topic/room/" + chatMessage.getRoomSeq(), savedMessage);
        }

        // 읽지 않은 메시지 수 업데이트
        updateUnreadMessageCount(chatMessage.getRoomSeq(), senderSeq);
    }

    /**
     * 사용자가 채팅방에 입장할 때 호출되는 메소드
     * @param chatMessage 채팅방 입장 정보를 포함한 메시지 객체
     * @param headerAccessor WebSocket 세션 정보를 포함한 헤더 접근자
     */
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageDTO chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에서 사용자 ID를 추출
        int empSeq = Integer.parseInt(headerAccessor.getUser().getName());
        
        // WebSocket 세션에 사용자 ID 저장 (Integer 객체로 저장)
        headerAccessor.getSessionAttributes().put("empSeq", Integer.valueOf(empSeq));
        
        // 사용자를 채팅방에 추가하고 업데이트된 채팅방 정보를 받아옴
        ChatRoomDTO updatedRoom = chatService.addUserToRoom(empSeq, chatMessage.getRoomSeq());

        // 입장 메시지 생성
        // 현재 작동하는가
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
     * 읽지 않은 메시지 수를 업데이트하고 해당 정보를 사용자에게 전송하는 메소드
     * @param roomSeq 채팅방 번호
     * @param senderSeq 메시지 발신자 ID
     */
    private void updateUnreadMessageCount(int roomSeq, int senderSeq) {
        // 채팅방의 모든 멤버 목록을 가져옴
        List<Integer> roomMembers = chatService.getRoomMembers(roomSeq);
        for (Integer memberSeq : roomMembers) {
            // 발신자를 제외한 모든 멤버의 읽지 않은 메시지 수 업데이트
            if (!memberSeq.equals(senderSeq)) {
                int unreadCount = chatService.getUnreadMessageCount(roomSeq, memberSeq);
                // 업데이트된 읽지 않은 메시지 수를 해당 사용자에게 전송
                messagingTemplate.convertAndSendToUser(
                    String.valueOf(memberSeq),
                    "/queue/unread",
                    Map.of("roomSeq", roomSeq, "unreadCount", unreadCount)
                );
            }
        }
    }

    /**
     * 메시지 읽음 처리를 수행하는 메소드
     * @param readMessageDTO 읽은 메시지 정보를 포함한 DTO
     * @param headerAccessor WebSocket 세션 정보를 포함한 헤더 접근자
     */
    @MessageMapping("/chat.readMessages")
    public void readMessages(@Payload ReadMessageDTO readMessageDTO, SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에서 사용자 ID를 추출
        Integer empSeq = Integer.parseInt(headerAccessor.getUser().getName());
        // 메시지를 읽음 처리
        chatService.markMessagesAsRead(readMessageDTO.getRoomSeq(), empSeq, readMessageDTO.getMessageSeq());

        // 읽음 처리 후 업데이트된 읽지 않은 메시지 수 계산
        int unreadCount = chatService.getUnreadMessageCount(readMessageDTO.getRoomSeq(), empSeq);
        // 업데이트된 읽지 않은 메시지 수를 사용자에게 전송
        messagingTemplate.convertAndSendToUser(
            String.valueOf(empSeq),
            "/queue/unread",
            Map.of("roomSeq", readMessageDTO.getRoomSeq(), "unreadCount", unreadCount)
        );
    }
}