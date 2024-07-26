package com.clover.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.gson.Gson;

@Configuration
public class BeanConfig {
    
    @Bean
    public Gson getGson() {
        return new Gson();
    }
}
