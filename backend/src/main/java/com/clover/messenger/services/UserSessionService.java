package com.clover.messenger.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.messenger.dao.UserSessionDAO;

@Service
public class UserSessionService {

    @Autowired
    private UserSessionDAO userSessionDAO;

    public void insertOrUpdateUserSession(String sessionId, int empSeq, String empName, String empAvatar, int deptCode) {
        System.out.println("UserSessionService: insertOrUpdateUserSession 호출됨");
        System.out.println("sessionId: " + sessionId);
        System.out.println("empSeq: " + empSeq);
        System.out.println("cloverName: " + empName);
        System.out.println("cloverAvatar: " + empAvatar);
        System.out.println("deptCode: " + deptCode);
        userSessionDAO.insertOrUpdateUserSession(sessionId, empSeq, empName, empAvatar, deptCode);
    }

    public void removeUserSession(String sessionId) {
        userSessionDAO.deleteUserSession(sessionId);
    }

    public void cleanSessions() {
        // 24시간 이상 지속된 세션 제거
        userSessionDAO.deleteOldSessions(24);

        // 1시간 이상 비활성 상태인 세션 제거
        userSessionDAO.deleteInactiveSessions(1);
    }

    public void updateLastActivityTime(String sessionId) {
        userSessionDAO.updateLastActivityTime(sessionId);
    }

    public List<Map<String, Object>> getOnlineUsersByDeptCode(int deptCode) {
        return userSessionDAO.getOnlineUsersByDeptCode(deptCode);
    }
    
}
