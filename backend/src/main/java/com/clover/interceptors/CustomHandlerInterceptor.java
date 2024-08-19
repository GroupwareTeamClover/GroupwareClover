package com.clover.interceptors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.clover.messenger.services.UserSessionService;

// 일반 http 요청에서 사용자 세션 정보를 저장하거나 업데이트 하는 역할
@Component
public class CustomHandlerInterceptor implements HandlerInterceptor {

    @Autowired
    private UserSessionService userSessionService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        HttpSession session = request.getSession(false); // false를 사용하여 세션이 없으면 새로 생성하지 않음

        if (session == null || session.getAttribute("cloverSeq") == null) {
            System.out.println("세션이 없음.");
            return false; // 로그인되지 않은 경우 연결 거부
        }

        System.out.println("custom 왔다 감");
        String sessionId = session.getId();
        int empSeq = (int) session.getAttribute("cloverSeq");
        String cloverName = (String) session.getAttribute("cloverName");
        String cloverAvatar = (String) session.getAttribute("cloverAvatar");
        int deptCode = (int) session.getAttribute("cloverDeptCode");

        userSessionService.insertOrUpdateUserSession(sessionId, empSeq, cloverName, cloverAvatar, deptCode);

        return true; 
    }
}
