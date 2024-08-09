package com.clover.messenger.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.messenger.dao.UserSessionDAO;

@Service
public class UserSessionService {

    @Autowired
    private UserSessionDAO userSessionDAO;

    public void saveUserSession(String sessionId, int empSeq, String cloverName, String cloverAvatar, int deptCode) {
        userSessionDAO.insertUserSession(sessionId, empSeq, cloverName, cloverAvatar, deptCode);
    }

    public void removeUserSession(String sessionId) {
        userSessionDAO.deleteUserSession(sessionId);
    }
    
}
