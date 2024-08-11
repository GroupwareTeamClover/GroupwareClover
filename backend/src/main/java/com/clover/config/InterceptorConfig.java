// package com.clover.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import com.clover.interceptors.HttpSessionInterceptor;

// @Configuration
// public class InterceptorConfig implements WebMvcConfigurer{
    

//     @Override
//     public void addInterceptors(InterceptorRegistry registry) {
//         registry.addInterceptor(HttpSessionInterceptor()).addPathPatterns("/**");
//     }

//     @Bean
//     public HttpSessionInterceptor httpSessionInterceptor() {
//         return new HttpSessionInterceptor();
//     }

// }
