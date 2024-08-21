package com.clover.messenger.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.dto.ReadMessageDTO;
import com.clover.messenger.services.ChatMessageService;
import com.clover.messenger.services.ChatRoomService;

import java.util.List;
import java.util.Map;

@Controller
public class ChatMessageWebSocketController {

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private ChatRoomService chatRoomService;

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
        ChatMessageDTO savedMessage = chatMessageService.saveMessage(chatMessage);

        // 읽지 않은 메시지 수 업데이트
        updateUnreadMessageCount(chatMessage.getRoomSeq(), senderSeq);
        
        // 채팅방의 모든 사용자에게 메시지 브로드캐스트
        messagingTemplate.convertAndSend("/topic/room/" + chatMessage.getRoomSeq(), savedMessage);

        // 채팅방의 모든 참여자에게 채팅방 목록 업데이트 전송
        List<Integer> roomMembers = chatRoomService.getRoomMembers(chatMessage.getRoomSeq());
        for (Integer memberSeq : roomMembers) {
            sendChatRoomsUpdate(memberSeq);
        }
    }

    /**
     * 메시지 읽음 처리를 수행하는 메소드
     * @param readMessageDTO 읽은 메시지 정보를 포함한 DTO
     * @param headerAccessor WebSocket 세션 정보를 포함한 헤더 접근자
     */
    @MessageMapping("/chat.readMessages")
    public void readMessages(@Payload ReadMessageDTO readMessageDTO, SimpMessageHeaderAccessor headerAccessor) {
        Integer empSeq = Integer.parseInt(headerAccessor.getUser().getName());
        chatMessageService.markMessagesAsRead(readMessageDTO.getRoomSeq(), empSeq);

        // 읽음 처리 후 업데이트된 읽지 않은 메시지 수 계산
        int unreadCount = chatMessageService.getUnreadMessageCount(readMessageDTO.getRoomSeq(), empSeq);
        
        // 업데이트된 읽지 않은 메시지 수를 사용자에게 전송
        messagingTemplate.convertAndSendToUser(
            String.valueOf(empSeq),
            "/queue/unread",
            Map.of("roomSeq", readMessageDTO.getRoomSeq(), "unreadCount", unreadCount)
        );
    }

    /**
     * 읽지 않은 메시지 수를 업데이트하고 해당 정보를 사용자에게 전송하는 메소드
     * @param roomSeq 채팅방 번호
     * @param senderSeq 메시지 발신자 ID
     */
    private void updateUnreadMessageCount(int roomSeq, int senderSeq) {
        // 채팅방의 모든 멤버 목록을 가져옴
        List<Integer> roomMembers = chatRoomService.getRoomMembers(roomSeq);
        for (Integer memberSeq : roomMembers) {
            // 발신자를 제외한 모든 멤버의 읽지 않은 메시지 수 업데이트
            if (!memberSeq.equals(senderSeq)) {
                int unreadCount = chatMessageService.getUnreadMessageCount(roomSeq, memberSeq);
                // 업데이트된 읽지 않은 메시지 수를 해당 사용자에게 전송
                messagingTemplate.convertAndSendToUser(
                    String.valueOf(memberSeq),
                    "/queue/unread",
                    Map.of("roomSeq", roomSeq, "unreadCount", unreadCount)
                );
            }
        }
    }

    private void sendChatRoomsUpdate(int empSeq) {
    List<ChatRoomDTO> updatedRooms = chatRoomService.getChatRoomsWithDetails(empSeq);
    messagingTemplate.convertAndSendToUser(
        String.valueOf(empSeq),
        "/queue/chatRoomsUpdate",
        updatedRooms
    );
}
}
