package com.clover.messenger.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.clover.messenger.services.UserSessionService;

import java.util.List;
import java.util.Map;

@Controller
public class UserStatusWebSocketController {

    @Autowired
    private UserSessionService userSessionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 사용자의 온라인 상태를 업데이트하고 브로드캐스트하는 메소드
     * @param headerAccessor WebSocket 세션 정보를 포함한 헤더 접근자
     */
    @MessageMapping("/chat.updateUserStatus")
    public void updateUserStatus(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        userSessionService.updateLastActivityTime(sessionId);
        broadcastOnlineUsers(headerAccessor);
    }

    /**
     * 온라인 사용자 목록을 브로드캐스트하는 메소드
     * @param headerAccessor WebSocket 세션 정보를 포함한 헤더 접근자
     */
    private void broadcastOnlineUsers(SimpMessageHeaderAccessor headerAccessor) {
        Integer deptCode = (Integer) headerAccessor.getSessionAttributes().get("cloverDeptCode");
        if (deptCode != null) {
            List<Map<String, Object>> onlineUsers = userSessionService.getOnlineUsersByDeptCode(deptCode);
            messagingTemplate.convertAndSend("/topic/userStatus/" + deptCode, onlineUsers);
        }
    }
}