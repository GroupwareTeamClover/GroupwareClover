// package com.clover.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import com.clover.interceptors.CustomHandlerInterceptor;

// @Configuration
// public class InterceptorConfig implements WebMvcConfigurer {

//     @Autowired
//     private CustomHandlerInterceptor customHandlerInterceptor;

//     @Override
//     public void addInterceptors(InterceptorRegistry registry) {
//         registry.addInterceptor(customHandlerInterceptor)
//                 .addPathPatterns("/**")
//                 .excludePathPatterns("/community")
//                 .excludePathPatterns("/sign/**");
//     }
// }
