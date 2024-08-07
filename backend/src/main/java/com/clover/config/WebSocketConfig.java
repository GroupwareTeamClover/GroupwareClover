package com.clover.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import com.clover.interceptors.HttpSessionInterceptor;

// WebSocket 설정을 위한 Configuration 클래스
@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // application.properties 또는 application.yml에서 허용된 오리진 설정을 가져옴
    @Value("${properties.file.allowed.origins}")
    private String[] allowedOrigins;

    // 메시지 브로커 설정
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 하트비트 처리를 위한 ThreadPoolTaskScheduler 설정
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(1); // 단일 스레드 사용
        taskScheduler.setThreadNamePrefix("wss-heartbeat-thread-");
        taskScheduler.initialize();

        // 메시지 브로커 활성화 및 설정
        config.enableSimpleBroker("/topic", "/queue", "/user") // 메시지 구독 엔드포인트 설정 // user 추가
              .setHeartbeatValue(new long[]{10000, 20000}) // 클라이언트와 서버 간 하트비트 간격 설정
              .setTaskScheduler(taskScheduler); // 하트비트 처리를 위한 스케줄러 설정

        // 클라이언트에서 메시지를 보낼 때 사용할 접두사 설정
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user"); // user
    }

    // STOMP 엔드포인트 등록
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(allowedOrigins)
                .addInterceptors(new HttpSessionInterceptor()) // 여기에 인터셉터 추가
                .withSockJS();
    }

    // 클라이언트 인바운드 채널 설정 (클라이언트에서 서버로 메시지 전송 시)
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    HttpSession session = (HttpSession) accessor.getSessionAttributes().get("HTTP_SESSION");
                    if (session != null) {
                        String wsToken = (String) session.getAttribute("wsToken");
                        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
                        String sessionWsToken = accessor.getFirstNativeHeader("X-WS-Token");
                        
                        if (wsToken != null && wsToken.equals(sessionWsToken)) {
                            accessor.setUser(() -> empSeq.toString());
                        } else {
                            return null; // 연결 거부
                        }
                    } else {
                        return null; // 세션이 없는 경우 연결 거부
                    }
                }
                return message;
            }
        });
    }
}