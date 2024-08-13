package com.clover.messenger.dao;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserSessionDAO {

    @Autowired
    private SqlSession mybatis;

    public void insertOrUpdateUserSession(String sessionId, int empSeq, String empName, String empAvatar, int deptCode) {
        Map<String, Object> params = new HashMap<>();
        params.put("sessionId", sessionId);
        params.put("empSeq", empSeq);
        params.put("empName", empName);
        params.put("empAvatar", empAvatar);
        params.put("deptCode", deptCode);
        mybatis.insert("UserSession.insertOrUpdateUserSession", params);
    }

    public void deleteUserSession(String sessionId) {
        mybatis.delete("UserSession.deleteUserSession", sessionId);
    }

    public void deleteOldSessions(int hours) {
        mybatis.delete("UserSession.deleteOldSessions", hours);
    }

    public void deleteInactiveSessions(int hours) {
        mybatis.delete("UserSession.deleteInactiveSessions", hours);
    }

    public void updateLastActivityTime(String sessionId) {
        mybatis.update("UserSession.updateLastActivityTime", sessionId);
    }

    
}
