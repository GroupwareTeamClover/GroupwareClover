package com.clover.messenger.dao;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dto.ChatRoomDTO;

@Repository
public class ChatRoomDAO {

    @Autowired
    private SqlSession mybatis;

    /**
     * 사용자를 채팅방에 추가하는 메서드
     * @param empSeq 추가할 사용자의 사원 번호
     * @param roomSeq 사용자를 추가할 채팅방 번호
     */
    public void addUserToRoom(int empSeq, int roomSeq) {
        mybatis.insert("ChatRoomMapper.addUserToRoom", Map.of("empSeq", empSeq, "roomSeq", roomSeq));
    }    

    /**
     * 1:1 새로운 채팅방을 생성하는 메서드
     * @param empSeq1 채팅방을 생성하는 사용자 empSeq
     * @param empSeq2 채팅방을 생성당하는 사용자 empSeq
     * @return 생성할 채팅방 정보
     */    
    public ChatRoomDTO getExistingOneToOneRoom(int empSeq1, int empSeq2) {
        Map<String, Object> params = new HashMap<>();
        params.put("empSeq1", empSeq1);
        params.put("empSeq2", empSeq2);
        return mybatis.selectOne("ChatRoomMapper.getExistingOneToOneRoom", params);
    }

    /**
     * 1:1 채팅방 생성 시 상대방의 채팅방 이름, 아바타를 업데이트하는 메소드
     * @param roomSeq 사용자의 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     * @param roomInfo 해당하는 채팅방 번호
     */    
    public void updateRoomInfo(int roomSeq, int empSeq, ChatRoomDTO roomInfo) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        params.put("roomName", roomInfo.getRoomName());
        params.put("roomAvatar", roomInfo.getRoomAvatar());
        mybatis.update("ChatRoomMapper.updateRoomInfo", params);
    }

    /**
     * 채팅방 번호와 타겟empSeq로 상대방의 이름, 아바타를 가져오는 메서드
     * @param roomSeq 사용자의 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     * @return 사용자의 프로필 정보
     */
    public HashMap<String, Object> getOtherUserInRoom(int roomSeq, int empSeq) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq); 
        params.put("empSeq", empSeq);
        return mybatis.selectOne("ChatRoomMapper.getEmployeeInfo", params);
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
        ChatRoomDTO room = mybatis.selectOne("ChatRoomMapper.getRoomById", params);
        
        // 채팅방 참여자 정보 조회
        if (room == null) {
            return null;
        }
        
        List<EmployeeDTO> participants = mybatis.selectList("ChatRoomMapper.getRoomParticipants", roomSeq);
        room.setParticipants(participants);
        
        return room;
    }   

    /**
     * 특정 사용자의 모든 채팅방 목록을 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 사용자가 참여중인 채팅방 목록
     */
    public List<ChatRoomDTO> getChatRooms(int empSeq) {
        return mybatis.selectList("ChatRoomMapper.getChatRoomsWithCustomInfo", empSeq);
    }

    /**
     * 새로운 채팅방을 생성하는 메서드
     * @param room 생성할 채팅방 정보
     */
    public void createRoom(ChatRoomDTO room) {
        room.setRoomCreateTime(new Timestamp(System.currentTimeMillis()));
        mybatis.insert("ChatRoomMapper.createRoom", room);
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
        mybatis.update("ChatRoomMapper.updateLastAccessTime", params);
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
        Integer count = mybatis.selectOne("ChatRoomMapper.isUserInRoom", params);
        return count != null && count > 0;
    }

    /**
     * 채팅방 멤버 목록을 조회하는 메서드
     * @param roomSeq 채팅방 번호
     * @return 채팅방 멤버의 사원 번호 목록
     */
    public List<Integer> getRoomMembers(int roomSeq) {
        return mybatis.selectList("ChatRoomMapper.getRoomMembers", roomSeq);
    }
    
    /**
     * 새로운 그룹 채팅방을 생성하는 메서드
     * @param room 생성할 그룹 채팅방 정보
     */
    public void createGroupRoom(ChatRoomDTO room) {
        room.setRoomCreateTime(new Timestamp(System.currentTimeMillis()));
        mybatis.insert("ChatRoomMapper.createGroupRoom", room);
    }

    /**
     * 그룹 채팅방에 멤버를 추가하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 추가할 멤버의 사원 번호
     * @param memberRole 추가할 멤버의 역할
     */
    public void addGroupMember(int roomSeq, int empSeq, String memberRole) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        params.put("memberRole", memberRole);
        mybatis.insert("ChatRoomMapper.addGroupMember", params);
    }

    /**
     * 사용자를 채팅방에서 제거하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     */
    public void removeUserFromRoom(int roomSeq, int empSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        mybatis.delete("ChatRoomMapper.removeUserFromRoom", params);
    }

    /**
     * 채팅방의 참여자 수를 확인하는 메서드
     * @param roomSeq 채팅방 번호
     * @return 채팅방 참여자 수
     */
    public int getRoomParticipantCount(int roomSeq) {
        return mybatis.selectOne("ChatRoomMapper.getRoomParticipantCount", roomSeq);
    }

    /**
     * 채팅방을 삭제하는 메서드
     * @param roomSeq 삭제할 채팅방 번호
     */
    public void deleteRoom(int roomSeq) {
        mybatis.delete("ChatRoomMapper.deleteRoom", roomSeq);
    }

    /**
     * 채팅방 나가기 처리를 하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 나가는 사용자의 사원 번호
     * @return 채팅방이 삭제되었는지 여부 (1:1 채팅방의 경우)
     */
    public boolean leaveChat(int roomSeq, int empSeq) {
        removeUserFromRoom(roomSeq, empSeq);
        int participantCount = getRoomParticipantCount(roomSeq);
        if (participantCount == 0) {
            deleteRoom(roomSeq);
            return true;
        }
        return false;
    }

    /**
     * 채팅방 알림 설정을 업데이트하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     * @param enabled 알림 활성화 여부 ('Y' 또는 'N')
     */
    public void updateNotificationSettings(int roomSeq, int empSeq, String enabled) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        params.put("enabled", enabled);
        mybatis.update("ChatRoomMapper.updateNotificationSettings", params);
    }

    /**
     * 특정 사용자의 채팅 기록을 삭제하는 메서드
     * @param roomSeq 채팅 기록을 삭제할 채팅방 번호
     * @param empSeq 채팅 기록을 삭제할 사용자의 사원 번호
     */
    public void deleteChatHistory(int roomSeq, int empSeq) {
        Map<String, Object> params = new HashMap<>();
        params.put("roomSeq", roomSeq);
        params.put("empSeq", empSeq);
        mybatis.delete("ChatRoomMapper.deleteChatHistory", params);
    }
}
