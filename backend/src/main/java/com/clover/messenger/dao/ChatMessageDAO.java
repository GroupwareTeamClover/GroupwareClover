package com.clover.messenger.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.messenger.dto.ChatMessageDTO;

@Repository
public class ChatMessageDAO {

    @Autowired
    private SqlSession mybatis;

    /**
     * 채팅 메시지를 저장하는 메서드
     * @param message 저장할 채팅 메시지
     */
    public void saveMessage(ChatMessageDTO message) {
        if (message.getMessageContent() == null) {
            message.setMessageContent(""); // 빈 문자열로 설정
        }
        mybatis.insert("ChatMessageMapper.saveMessage", message);
    }

    /**
     * 특정 채팅방의 메시지 목록을 조회하는 메서드
     * @param roomSeq 조회할 채팅방 번호
     * @param empSeq 조회하는 사용자의 사원 번호
     * @return 채팅방의 메시지 목록
     */
    public List<ChatMessageDTO> getRoomMessages(int roomSeq, int empSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        return mybatis.selectList("ChatMessageMapper.getRoomMessages", params);
    }

    /**
     * 마지막으로 읽은 메시지를 업데이트하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @param roomSeq 채팅방 번호
     * @param messageSeq 마지막으로 읽은 메시지 번호
     */
    public void updateLastReadMessage(int empSeq, int roomSeq, int messageSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("empSeq", empSeq);
        params.put("roomSeq", roomSeq);
        params.put("messageSeq", messageSeq);
        mybatis.update("ChatMessageMapper.updateLastReadMessage", params);
    }

    /**
     * 읽지 않은 메시지 수를 조회하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     * @return 읽지 않은 메시지 수
     */
    public int getUnreadMessageCount(int roomSeq, int empSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        return mybatis.selectOne("ChatMessageMapper.getUnreadMessageCount", params);
    }

    /**
     * 채팅방의 마지막 메시지를 조회하는 메서드
     * @param roomSeq 채팅방 번호
     * @return 마지막 메시지 정보
     */
    public ChatMessageDTO getLastMessage(int roomSeq) {
        return mybatis.selectOne("ChatMessageMapper.getLastMessage", roomSeq);
    }

    /**
     * 채팅방 메시지 기록을 삭제하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     */
    public void deleteChatHistory(int roomSeq, int empSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        mybatis.delete("ChatMessageMapper.deleteChatHistory", params);
    }
}
