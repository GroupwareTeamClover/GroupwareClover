package com.clover.interceptors;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import jakarta.servlet.http.HttpSession;

public class HttpSessionInterceptor implements HandshakeInterceptor {

    /**
     * WebSocket 핸드셰이크 전에 호출되는 메서드
     * 
     * @param request WebSocket 요청
     * @param response WebSocket 응답
     * @param wsHandler WebSocket 핸들러
     * @param attributes HandshakeInterceptor와 WebSocketHandler 간에 공유되는 속성
     * @return 핸드셰이크를 계속 진행할지 여부
     */
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        // if (request instanceof ServletServerHttpRequest) {
        //     ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
        //     HttpSession session = servletRequest.getServletRequest().getSession();
        //     attributes.put("hSession", session);

        //     // 로그인 여부 확인
        //     if (session.getAttribute("loginID") == null) {
        //         return false; // 로그인되지 않은 경우 연결 거부
        //     }
        // }
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            HttpSession session = servletRequest.getServletRequest().getSession();
            attributes.put("hSession", session);
        }                        
        return true;
    }

    /**
     * WebSocket 핸드셰이크 후에 호출되는 메서드
     * 
     * @param request WebSocket 요청
     * @param response WebSocket 응답
     * @param wsHandler WebSocket 핸들러
     * @param exception 핸드셰이크 중 발생한 예외 (있는 경우)
     */
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                               WebSocketHandler wsHandler, Exception exception) {
        // 핸드셰이크 후 추가 작업이 필요한 경우 여기에 구현
    }
}
