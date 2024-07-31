package com.clover.messenger.handlers;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.services.ChatService;
import com.google.gson.Gson;

import jakarta.servlet.http.HttpSession;

public class MessengerHandler extends TextWebSocketHandler {
    
    // 연결된 모든 WebSocket 세션을 저장하는 Set
    private Set<WebSocketSession> clients = Collections.synchronizedSet(new HashSet<>());
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private Gson gson;

    /**
     * WebSocket 연결이 설정되면 호출되는 메서드
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        clients.add(session);
        
        // HttpSession에서 사용자 ID 추출
        HttpSession httpSession = (HttpSession) session.getAttributes().get("hSession");
        Integer empSeq = (Integer) httpSession.getAttribute("cloverSeq");
        
        System.out.println("WebSocket 연결 성공. 사용자 ID: " + empSeq);
        
        // WebSocketSession에 사용자 ID 저장
        session.getAttributes().put("empSeq", empSeq);
    }

    /**
     * 클라이언트로부터 메시지를 수신하면 호출되는 메서드
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ChatMessageDTO chatMessage = gson.fromJson(message.getPayload(), ChatMessageDTO.class);
        
        // WebSocketSession에서 사용자 ID 추출
        Integer empSeq = (Integer) session.getAttributes().get("empSeq");
        System.out.println("메시지 수신. 발신자 ID: " + empSeq);
        
        // 메시지에 발신자 ID 설정
        chatMessage.setSenderSeq(empSeq);
        
        // 메시지 저장
        chatService.saveMessage(chatMessage);
        
        // 같은 채팅방에 있는 모든 클라이언트에게 메시지 전송
        for (WebSocketSession client : clients) {
            if (client.isOpen() && chatService.isUserInRoom(empSeq, chatMessage.getRoomSeq())) {
                client.sendMessage(new TextMessage(gson.toJson(chatMessage)));
            }
        }
    }

    /**
     * WebSocket 연결이 종료되면 호출되는 메서드
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        clients.remove(session);
        System.out.println("WebSocket 연결 종료");
    }
}