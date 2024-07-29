package com.clover.messenger.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;

import com.clover.messenger.dao.ChatDAO;
import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;

@Service
public class ChatService {
    @Autowired
    private ChatDAO chatDAO;

    @Transactional
    public ChatRoomDTO createRoom(ChatRoomDTO room) {
        chatDAO.createRoom(room);
        return room;
    }

    @Transactional
    public void saveMessage(ChatMessageDTO message) {
        chatDAO.saveMessage(message);
    }

    public List<ChatMessageDTO> getRoomMessages(int roomSeq) {
        return chatDAO.getRoomMessages(roomSeq);
    }

    @Transactional
    public void addUserToRoom(int empSeq, int roomSeq) {
        chatDAO.addUserToRoom(empSeq, roomSeq);
    }

    public ChatRoomDTO getRoomById(int roomSeq) {
        return chatDAO.getRoomById(roomSeq);
    }

    public boolean isUserInRoom(WebSocketSession session, int roomSeq) {
        String loginID = (String) session.getAttributes().get("loginID");
        if (loginID == null) {
            return false;
        }
        return chatDAO.isUserInRoom(Integer.parseInt(loginID), roomSeq);
    }
}