package com.clover.messenger.services;

import java.util.HashMap;
import java.util.List;
import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dao.ChatDAO;
import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.dto.NotificationDTO;
import com.clover.employee.dao.EmployeeDAO;

@Service
public class ChatService {
    @Autowired
    private ChatDAO chatDAO;

    /**
     * 특정 사용자의 모든 채팅방 목록을 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 채팅방 목록
     */
    public List<ChatRoomDTO> getChatRooms(int empSeq) {
        return chatDAO.getChatRooms(empSeq);
    }

    @Transactional
    public ChatRoomDTO addUserToRoom(int empSeq, int roomSeq) {
        // 사용자를 채팅방에 추가하는 로직
        chatDAO.addUserToRoom(empSeq, roomSeq);
        ChatRoomDTO updatedRoom = getRoomById(roomSeq, empSeq);
        if(updatedRoom != null){
            System.out.println("서비스 오류");
        }
        
        // 업데이트된 채팅방 정보를 반환
        return updatedRoom;
    }    

    /**
     * 1:1 채팅방을 생성하는 메서드
     * @param empSeq 채팅방을 생성하는 사용자의 사원 번호
     * @param targetEmpSeq 대화 상대방의 사원 번호
     * @return 생성된 채팅방 정보
     */
     // issue : ChatMembers의 데이터가 너무 커질 우려가 있다. 생각해봐야 함.
     @Transactional
     public ChatRoomDTO createOneToOneRoom(int empSeq, int targetEmpSeq) {
         ChatRoomDTO existingRoom = chatDAO.getExistingOneToOneRoom(empSeq, targetEmpSeq);
         if (existingRoom != null) {
             return existingRoom;
         }
     
         ChatRoomDTO room = new ChatRoomDTO();
         EmployeeDTO creator = chatDAO.getEmployeeName(empSeq);
         EmployeeDTO target = chatDAO.getEmployeeName(targetEmpSeq);
     
         room.setRoomType("private");
         room.setEmpSeq(empSeq);
         room.setRoomDescription("1:1 채팅방");
         
         // 임시로 방 이름 설정 (실제로는 사용되지 않을 것임)
         room.setRoomName("1:1 Chat");
         room.setRoomAvatar("default_avatar");
     
         // 채팅방 생성
         chatDAO.createRoom(room);
     
         // 채팅방 멤버 추가
         chatDAO.addUserToRoom(empSeq, room.getRoomSeq());
         chatDAO.addUserToRoom(targetEmpSeq, room.getRoomSeq());
     
         // 사용자 A (creator)를 위한 채팅방 정보 설정
         ChatRoomDTO roomForCreator = new ChatRoomDTO(room);
         roomForCreator.setRoomName(target.getEmpName());
         roomForCreator.setRoomAvatar(target.getEmpAvatar());
         chatDAO.updateRoomInfo(room.getRoomSeq(), empSeq, roomForCreator);
     
         // 사용자 B (target)를 위한 채팅방 정보 설정
         ChatRoomDTO roomForTarget = new ChatRoomDTO(room);
         roomForTarget.setRoomName(creator.getEmpName());
         roomForTarget.setRoomAvatar(creator.getEmpAvatar());
         chatDAO.updateRoomInfo(room.getRoomSeq(), targetEmpSeq, roomForTarget);
     
         return roomForCreator; // creator의 시점에서의 채팅방 정보 반환
     }
    /**
     * 특정 채팅방의 메시지 목록을 가져오는 메서드
     * @param roomSeq 조회할 채팅방 번호
     * @param empSeq 조회하는 사용자의 사원 번호
     * @return 채팅 메시지 목록
     */
    public List<ChatMessageDTO> getRoomMessages(int roomSeq, int empSeq) {
        return chatDAO.getRoomMessages(roomSeq, empSeq);
    }

    /**
     * 특정 채팅방을 조회하는 메서드
     * @param roomSeq 조회할 채팅방 번호
     * @param empSeq 조회하는 사용자의 사원 번호
     * @return 조회된 채팅방 정보
     */
    public ChatRoomDTO getRoomById(int roomSeq, int empSeq) {
        return chatDAO.getRoomById(roomSeq, empSeq);
    }

    /**
     * 메시지를 저장하는 메서드
     * @param message 저장할 채팅 메시지
     * @return 저장된 채팅 메시지
     */
    @Transactional
    public ChatMessageDTO saveMessage(ChatMessageDTO message) {
        chatDAO.saveMessage(message);
        return message;
    }

    /**
     * 읽지 않은 메시지 수를 조회하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     * @return 읽지 않은 메시지 수
     */
    public int getUnreadMessageCount(int roomSeq, int empSeq) {
        return chatDAO.getUnreadMessageCount(roomSeq, empSeq);
    }

    /**
     * 메시지를 읽음 처리하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     * @param messageSeq 마지막으로 읽은 메시지 번호
     */
    public void markMessagesAsRead(int roomSeq, int empSeq, int messageSeq) {
        chatDAO.updateLastReadMessage(empSeq, roomSeq, messageSeq);
    }

    /**
     * 특정 사용자가 특정 채팅방에 속해 있는지 확인하는 메서드
     * @param empSeq 확인할 사용자의 사원 번호
     * @param roomSeq 확인할 채팅방 번호
     * @return 사용자가 채팅방에 속해 있으면 true, 그렇지 않으면 false
     */
    public boolean isUserInRoom(int empSeq, int roomSeq) {
        return chatDAO.isUserInRoom(empSeq, roomSeq);
    }

    /**
     * 온라인 사용자 목록을 조회하는 메서드
     * @param currentUserSeq 현재 로그인한 사용자의 사원 번호
     * @return 온라인 사용자 목록 (현재 사용자 제외)
     */
    public List<EmployeeDTO> getOnlineUsers(int currentUserSeq) {
        return chatDAO.getOnlineUsers(currentUserSeq);
    }

    /**
     * 조직도 정보를 조회하는 메서드
     * @return 조직도 정보
     */    
	public List<HashMap<String, Object>> getOrganization(){
		return chatDAO.getOrganization();
	}

     /**
     * 특정 사용자의 프로필 정보를 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 사용자의 프로필 정보
     */
    public HashMap<String, Object> getProfile(int empSeq) {
        return chatDAO.getProfile(empSeq);
    }

    /**
     * 알림을 저장하는 메서드
     * @param notification 저장할 알림 정보
     */
    public void saveNotification(NotificationDTO notification) {
        chatDAO.saveNotification(notification);
    }

    /**
     * 알림 목록을 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 알림 목록
     */
    public List<NotificationDTO> getNotifications(int empSeq) {
        return chatDAO.getNotifications(empSeq);
    }

    /**
     * 알림을 읽음 처리하는 메서드
     * @param notificationSeq 알림 번호
     */
    public void markNotificationAsRead(int notificationSeq) {
        chatDAO.markNotificationAsRead(notificationSeq);
    }  
    
    /**
     * 채팅방 멤버의 마지막 접속 시간을 업데이트하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @param roomSeq 채팅방 번호
     */
    public void updateLastAccessTime(int empSeq, int roomSeq) {
        chatDAO.updateLastAccessTime(empSeq, roomSeq);
    }

    /**
     * 채팅방 멤버 목록을 조회하는 메서드
     * @param roomSeq 채팅방 번호
     * @return 채팅방 멤버의 사원 번호 목록
     */
    public List<Integer> getRoomMembers(int roomSeq) {
        return chatDAO.getRoomMembers(roomSeq);
    }    

}