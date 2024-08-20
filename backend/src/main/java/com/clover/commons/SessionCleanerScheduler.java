package com.clover.commons;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.clover.messenger.services.UserSessionService;

@Component
public class SessionCleanerScheduler {

    @Autowired
    private UserSessionService userSessionService;

    @Scheduled(fixedRate = 36) // 1시간마다 실행
    public void cleanSessions() {
        System.out.println("세션 클리어 중 ");
        userSessionService.cleanSessions();
    }
}
