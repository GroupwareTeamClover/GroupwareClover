package com.clover.messenger.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.sql.Timestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;

@Repository
public class ChatDAO {
    private static final Logger logger = LoggerFactory.getLogger(ChatDAO.class);
    @Autowired
    private SqlSession mybatis;

    @Autowired
    private SqlSession sqlSession;
    /**
     * 특정 사용자의 모든 채팅방 목록을 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 사용자가 참여중인 채팅방 목록
     */
    public List<ChatRoomDTO> getChatRooms(int empSeq) {
        return mybatis.selectList("Chat.getChatRooms", empSeq);
    }

    /**
     * 새로운 채팅방을 생성하는 메서드
     * @param room 생성할 채팅방 정보
     */
    public void createRoom(ChatRoomDTO room) {
        room.setRoomCreateTime(new Timestamp(System.currentTimeMillis()));
        mybatis.insert("Chat.createRoom", room);
    }

    /**
     * 채팅 메시지를 저장하는 메서드
     * @param message 저장할 채팅 메시지
     */
    public void saveMessage(ChatMessageDTO message) {
        mybatis.insert("Chat.saveMessage", message);
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
        return mybatis.selectList("Chat.getRoomMessages", params);
    }

    /**
     * 사용자를 채팅방에 추가하는 메서드
     * @param empSeq 추가할 사용자의 사원 번호
     * @param roomSeq 사용자를 추가할 채팅방 번호
     */
    public void addUserToRoom(int empSeq, int roomSeq) {
        mybatis.insert("Chat.addUserToRoom", Map.of("empSeq", empSeq, "roomSeq", roomSeq));
    }

    /**
     * 특정 사용자가 특정 채팅방에 속해 있는지 확인하는 메서드
     * @param empSeq 확인할 사용자의 사원 번호
     * @param roomSeq 확인할 채팅방 번호
     * @return 사용자가 채팅방에 속해 있으면 true, 그렇지 않으면 false
     */
    public boolean isUserInRoom(int empSeq, int roomSeq) {
        Map<String, Object> params = Map.of("empSeq", empSeq, "roomSeq", roomSeq);
        Integer count = mybatis.selectOne("Chat.isUserInRoom", params);
        return count != null && count > 0;
    }

    /**
     * 특정 채팅방의 정보를 조회하고 참여자 목록을 설정하는 메서드
     * @param roomSeq 조회할 채팅방 번호
     * @param empSeq 조회하는 사용자의 사원 번호
     * @return 채팅방 정보와 다른 참여자 목록이 포함된 ChatRoomDTO 객체
     */
    public ChatRoomDTO getRoomById(int roomSeq, int empSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        
        // 채팅방 기본 정보 조회
        ChatRoomDTO room = mybatis.selectOne("Chat.getRoomById", params);
        
        // 채팅방 참여자 정보 조회
        List<EmployeeDTO> participants = mybatis.selectList("Chat.getRoomParticipants", roomSeq);
        
        // 현재 사용자를 제외한 다른 참여자 목록 설정
        room.setParticipants(participants.stream()
                .filter(p -> p.getEmpSeq() != empSeq)
                .collect(Collectors.toList()));
        
        return room;
    } 

    /**
     * 온라인 사용자 목록을 조회하는 메서드
     * @param currentUserSeq 현재 로그인한 사용자의 사원 번호
     * @return 온라인 사용자 목록 (현재 사용자 제외)
     */
    public List<EmployeeDTO> getOnlineUsers(int currentUserSeq) {
        return sqlSession.selectList("Chat.getOnlineUsers", currentUserSeq);
    }

    public List<HashMap<String, Object>> getOrganization(){
		return mybatis.selectList("Chat.getOrganization");
	}

    /**
     * 특정 사용자의 프로필 정보를 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 사용자의 프로필 정보
     */
    public HashMap<String, Object> getProfile(int empSeq) {
        return mybatis.selectOne("Chat.getProfile", empSeq);
    }
}