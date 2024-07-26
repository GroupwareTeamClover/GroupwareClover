package com.clover.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.clover.interceptors.HttpSessionInterceptor;
import com.clover.messenger.handlers.MessengerHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer{
        
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
        .addHandler(getMessengerHandler(), "/chat")
        .setAllowedOrigins("*")
        .addInterceptors(new HttpSessionInterceptor());
        
    }

    @Bean
    public WebSocketHandler getMessengerHandler() {
        return new MessengerHandler();
    }

}
