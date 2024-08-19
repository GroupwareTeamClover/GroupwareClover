package com.clover.messenger.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.clover.messenger.dto.ChatMessageDTO;

@Controller
public class NotificationWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 알림 설정을 토글할 때 호출되는 메소드
     * @param message 알림 설정 변경 정보를 포함한 메시지 객체
     */
    @MessageMapping("/chat.toggleNotifications")
    public void toggleNotifications(ChatMessageDTO message) {
        // 알림 설정 변경을 해당 사용자에게만 전송
        messagingTemplate.convertAndSendToUser(String.valueOf(message.getSenderSeq()), 
            "/queue/notifications", message);
    }
}