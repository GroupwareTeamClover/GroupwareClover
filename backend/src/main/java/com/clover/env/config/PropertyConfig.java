package com.clover.env.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@PropertySources({
    @PropertySource("classpath:properties/env.properties")
})
public class PropertyConfig implements WebMvcConfigurer{
    @Value("${properties.file.allowed.origins}")
    private String[] allowedOriStrings;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
    	registry.addMapping("/**").
		allowedOrigins(allowedOriStrings).		// 출처를 허락 - "url"로 부터 오는 요청을 허락하겠다. 
		allowedMethods("*").
		allowedHeaders("*").
		allowCredentials(true); 
    }
}
