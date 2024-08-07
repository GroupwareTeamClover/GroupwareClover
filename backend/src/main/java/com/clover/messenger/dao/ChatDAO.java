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
import com.clover.messenger.dto.NotificationDTO;


@Repository
public class ChatDAO {

    @Autowired
    private SqlSession mybatis;

    public ChatRoomDTO getExistingOneToOneRoom(int empSeq1, int empSeq2) {
        Map<String, Object> params = new HashMap<>();
        params.put("empSeq1", empSeq1);
        params.put("empSeq2", empSeq2);
        return mybatis.selectOne("Chat.getExistingOneToOneRoom", params);
    }

    public void updateRoomInfo(int roomSeq, int empSeq, ChatRoomDTO roomInfo) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        params.put("roomName", roomInfo.getRoomName());
        params.put("roomAvatar", roomInfo.getRoomAvatar());
        mybatis.update("Chat.updateRoomInfo", params);
    }
    

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
        System.out.println("채팅방테스트1" + room.getRoomSeq() + "" + room.getEmpSeq());
        System.out.println(room.getRoomSeq() + room.getEmpSeq());
        mybatis.insert("Chat.createRoom", room);
    }

    /**
     * 채팅 메시지를 저장하는 메서드
     * @param message 저장할 채팅 메시지
     */
    public void saveMessage(ChatMessageDTO message) {
        if (message.getMessageContent() == null) {
            message.setMessageContent(""); // 빈 문자열로 설정
        }
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
        Map<String, Object> params = new HashMap<>();
        params.put("empSeq", empSeq);
        params.put("roomSeq", roomSeq);
        Integer count = mybatis.selectOne("Chat.isUserInRoom", params);
        return count != null && count > 0;
    }

    /**
     * // 흠...
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
        if (room == null) {
            // 로그 추가
            System.out.println("room 오류 : " + roomSeq + empSeq); 
            return null; // 또는 새로운 ChatRoomDTO 객체 반환
        }
        
        List<EmployeeDTO> participants = mybatis.selectList("Chat.getRoomParticipants", roomSeq);
        room.setParticipants(participants);
        
        return room;
    } 

    /**
     * 온라인 사용자 목록을 조회하는 메서드
     * @param currentUserSeq 현재 로그인한 사용자의 사원 번호
     * @return 온라인 사용자 목록 (현재 사용자 제외)
     */
    public List<EmployeeDTO> getOnlineUsers(int currentUserSeq) {
        return mybatis.selectList("Chat.getOnlineUsers", currentUserSeq);
    }

    /**
     * 조직도 정보를 조회하는 메서드
     * @return 조직도 정보
     */    
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
        mybatis.update("Chat.updateLastReadMessage", params);
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
        return mybatis.selectOne("Chat.getUnreadMessageCount", params);
    }

    /**
     * 채팅방 멤버의 마지막 접속 시간을 업데이트하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @param roomSeq 채팅방 번호
     */
    public void updateLastAccessTime(int empSeq, int roomSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("empSeq", empSeq);
        params.put("roomSeq", roomSeq);
        mybatis.update("Chat.updateLastAccessTime", params);
    }

    /**
     * 채팅방 멤버 목록을 조회하는 메서드
     * @param roomSeq 채팅방 번호
     * @return 채팅방 멤버의 사원 번호 목록
     */
    public List<Integer> getRoomMembers(int roomSeq) {
        return mybatis.selectList("Chat.getRoomMembers", roomSeq);
    }

    /**
     * 알림을 저장하는 메서드
     * @param notification 저장할 알림 정보
     */
    public void saveNotification(NotificationDTO notification) {
        mybatis.insert("Chat.saveNotification", notification);
    }

    /**
     * 알림 목록을 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 알림 목록
     */
    public List<NotificationDTO> getNotifications(int empSeq) {
        return mybatis.selectList("Chat.getNotifications", empSeq);
    }

    /**
     * 알림을 읽음 처리하는 메서드
     * @param notificationSeq 알림 번호
     */
    public void markNotificationAsRead(int notificationSeq) {
        mybatis.update("Chat.markNotificationAsRead", notificationSeq);
    }    

    /**
     * 사원의 이름을 조회하는 메서드
     * @param empSeq 사원 번호
     * @return 사원의 이름
     */
    public EmployeeDTO getEmployeeName(int empSeq) {
        return mybatis.selectOne("Chat.getEmployeeName", empSeq);
    }
}