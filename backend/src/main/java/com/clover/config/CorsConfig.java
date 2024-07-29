package com.clover.config;

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
public class CorsConfig implements WebMvcConfigurer {

    @Value("${properties.file.allowed.origins}")
    private String[] allowedOrigins;

	@Override
	public void addCorsMappings(CorsRegistry registry) {

		registry.addMapping("/**").allowedOrigins(allowedOrigins).allowedMethods("*").allowedHeaders("*").allowCredentials(true);

	}



    // 아이피 허용 부분. allowedOrigins("*")과 credentials은 함께 허용해 줄 수 없음. 다른 방법 필요
    // @Value("${allowed.origins}")
    // private String[] allowedOrigins;
    // .allowedOrigins(allowedOrigins)

    // application.properties에 allowed.origins=http://192.168.1.5:3000, http://192.168.1.6:3000, etc... 

}
