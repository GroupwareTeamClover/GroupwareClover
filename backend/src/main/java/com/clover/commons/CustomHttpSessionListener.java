package com.clover.commons;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.clover.messenger.services.UserSessionService;

// 세션 연결 종료되었을 때 그걸 listen 하는 역할 
@Component
public class CustomHttpSessionListener implements HttpSessionListener {

    @Autowired
    private UserSessionService userSessionService;


    @Override
    public void sessionCreated(HttpSessionEvent se) {
        System.out.println("세션 생성됨 : " + se.getSession().getId());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        String sessionId = se.getSession().getId();
        System.out.println("세션 연결 종료 : " + sessionId);
        userSessionService.removeUserSession(sessionId);
    }
}
