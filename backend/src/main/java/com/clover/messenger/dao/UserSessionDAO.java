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

    public void insertUserSession(String sessionId, int empSeq, String cloverName, String cloverAvatar, int deptCode) {
        Map<String, Object> params = new HashMap<>();
        params.put("sessionId", sessionId);
        params.put("empSeq", empSeq);
        params.put("cloverName", cloverName);
        params.put("cloverAvatar", cloverAvatar);
        params.put("deptCode", deptCode);
        mybatis.insert("UserSession.insertUserSession", params);
    }

    public void deleteUserSession(String sessionId) {
        mybatis.delete("UserSession.deleteUserSession", sessionId);
    }

    
}
