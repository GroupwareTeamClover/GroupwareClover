package com.clover.messenger.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;

@Repository
public class ChatDAO {
    @Autowired
    private SqlSession mybatis;

    public void createRoom(ChatRoomDTO room) {
        mybatis.insert("Chat.createRoom", room);
    }

    public void saveMessage(ChatMessageDTO message) {
        mybatis.insert("Chat.saveMessage", message);
    }

    public List<ChatMessageDTO> getRoomMessages(int roomSeq) {
        return mybatis.selectList("Chat.getRoomMessages", roomSeq);
    }

    public void addUserToRoom(int empSeq, int roomSeq) {
        mybatis.insert("Chat.addUserToRoom", Map.of("empSeq", empSeq, "roomSeq", roomSeq));
    }

    public ChatRoomDTO getRoomById(int roomSeq) {
        return mybatis.selectOne("Chat.getRoomById", roomSeq);
    }
    public boolean isUserInRoom(int empSeq, int roomSeq) {
        Map<String, Object> params = Map.of("empSeq", empSeq, "roomSeq", roomSeq);
        Integer count = mybatis.selectOne("Chat.isUserInRoom", params);
        return count != null && count > 0;
    }
}
