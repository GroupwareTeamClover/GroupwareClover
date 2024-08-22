package com.clover.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.clover.interceptors.CustomHandleAdminInterceptor;
import com.clover.interceptors.CustomHandlerInterceptor;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

    @Autowired
    private CustomHandlerInterceptor customHandlerInterceptor;

    @Autowired
    private CustomHandleAdminInterceptor customHandleAdminInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(customHandlerInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/community/**")
                .excludePathPatterns("/adminpopup/**")
                .excludePathPatterns("/attachment/**")                
                .excludePathPatterns("/sign/**")
                .excludePathPatterns("/approval/**")
                .excludePathPatterns("/ws/**")
                .excludePathPatterns("/chat/**")
                .excludePathPatterns("/adminmember/**")
                .excludePathPatterns("/employee/**");
        
        
        registry.addInterceptor(customHandleAdminInterceptor)
        		.addPathPatterns("/adminlog/**")
        		.addPathPatterns("/adminaddmem/**")
//        		.addPathPatterns("/adminmember/**")
//        		.excludePathPatterns("/sign/**")
//        		.excludePathPatterns("/employee/**")
//        		.excludePathPatterns("/community/**")        		
//        		.excludePathPatterns("/attachment/**")
//        		.excludePathPatterns("/approval/**")
//        		.excludePathPatterns("/ws/**")
//        		.excludePathPatterns("/chat/**")
//        		.excludePathPatterns("/adminlog/**")
//        		.excludePathPatterns("/adminaddmem/**")
//        		.excludePathPatterns("/adminmember/**")
        		;
        
    }
    

    
    
    
    
}
