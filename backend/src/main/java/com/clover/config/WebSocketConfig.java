package com.clover.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.clover.interceptors.HttpSessionInterceptor;
import com.clover.messenger.handlers.MessengerHandler;

@Configuration
@EnableWebSocket
@PropertySources({
    @PropertySource("classpath:properties/env.properties")
})
public class WebSocketConfig implements WebSocketConfigurer {

    @Value("${properties.file.allowed.origins}")
    private String[] allowedOrigins;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
            .addHandler(getMessengerHandler(), "/chat")
            .setAllowedOrigins(allowedOrigins)
            .addInterceptors(new HttpSessionInterceptor());
    }

    @Bean
    public WebSocketHandler getMessengerHandler() {
        return new MessengerHandler();
    }
}