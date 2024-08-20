package com.clover.messenger.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dao.ChatRoomDAO;
import com.clover.messenger.dao.ChatMessageDAO;
import com.clover.messenger.dao.ChatProfileDAO;
import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.dto.ChatMessageDTO;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomDAO chatRoomDAO;

    @Autowired
    private ChatProfileDAO chatProfileDAO;

    @Autowired
    private ChatMessageDAO chatMessageDAO;  

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 사용자의 모든 채팅방 목록을 조회하고 각 채팅방의 마지막 메시지와 읽지 않은 메시지 수를 설정하는 메서드
     * 
     * @param empSeq 사용자의 사원 번호
     * @return 사용자가 참여 중인 모든 채팅방 목록
     */
    public List<ChatRoomDTO> getChatRoomsWithDetails(int empSeq) {
        List<ChatRoomDTO> rooms = chatRoomDAO.getChatRooms(empSeq);
        for (ChatRoomDTO room : rooms) {
            ChatMessageDTO lastMessage = chatMessageDAO.getLastMessage(room.getRoomSeq()); 
            int unreadCount = chatMessageDAO.getUnreadMessageCount(room.getRoomSeq(), empSeq); 
            room.setLastMessage(lastMessage != null ? lastMessage.getMessageContent() : null);
            room.setLastMessageTime(lastMessage != null ? lastMessage.getSendTime() : null);
            room.setUnreadCount(unreadCount);
        }
        return rooms;
    }

    /**
     * 채팅방 멤버 목록을 조회하는 메서드
     * 
     * @param roomSeq 채팅방 번호
     * @return 채팅방 멤버의 사원 번호 목록
     */
    public List<Integer> getRoomMembers(int roomSeq) {
        return chatRoomDAO.getRoomMembers(roomSeq);
    }    

    /**
     * 사용자를 채팅방에 추가하는 메서드
     * 
     * @param empSeq  추가할 사용자의 사원 번호
     * @param roomSeq 사용자를 추가할 채팅방 번호
     * @return 추가된 사용자가 포함된 채팅방 정보
     */
    @Transactional
    public ChatRoomDTO addUserToRoom(int empSeq, int roomSeq) {
        chatRoomDAO.addUserToRoom(empSeq, roomSeq);
        return chatRoomDAO.getRoomById(roomSeq, empSeq);
    }

    /**
     * 1:1 채팅방을 생성하는 메서드. 이미 존재하는 방이 있을 경우 해당 방을 반환.
     * 
     * @param empSeq       채팅방을 생성하는 사용자의 사원 번호
     * @param targetEmpSeq 대화 상대방의 사원 번호
     * @return 생성된 1:1 채팅방 정보 또는 기존 채팅방 정보
     */
    @Transactional
    public ChatRoomDTO createOneToOneRoom(int empSeq, int targetEmpSeq) {
        ChatRoomDTO existingRoom = chatRoomDAO.getExistingOneToOneRoom(empSeq, targetEmpSeq);
        if (existingRoom != null) {
            return existingRoom;
        }

        ChatRoomDTO room = new ChatRoomDTO();
        EmployeeDTO creator = chatProfileDAO.getEmployeeName(empSeq);
        EmployeeDTO target = chatProfileDAO.getEmployeeName(targetEmpSeq);

        room.setRoomType("private");
        room.setEmpSeq(empSeq);
        room.setRoomDescription("1:1 채팅방");
        room.setRoomName("1:1 Chat");
        room.setRoomAvatar("default_avatar");

        chatRoomDAO.createRoom(room);

        chatRoomDAO.addUserToRoom(empSeq, room.getRoomSeq());
        chatRoomDAO.addUserToRoom(targetEmpSeq, room.getRoomSeq());

        ChatRoomDTO roomForCreator = new ChatRoomDTO(room);
        roomForCreator.setRoomName(target.getEmpName());
        roomForCreator.setRoomAvatar(target.getEmpAvatar());
        chatRoomDAO.updateRoomInfo(room.getRoomSeq(), empSeq, roomForCreator);

        ChatRoomDTO roomForTarget = new ChatRoomDTO(room);
        roomForTarget.setRoomName(creator.getEmpName());
        roomForTarget.setRoomAvatar(creator.getEmpAvatar());
        chatRoomDAO.updateRoomInfo(room.getRoomSeq(), targetEmpSeq, roomForTarget);

        return roomForCreator;
    }

    /**
     * 사용자가 특정 채팅방에서 볼 수 있는 채팅방 정보를 가져오는 메서드
     * 
     * @param roomSeq 조회할 채팅방 번호
     * @param empSeq  조회하는 사용자의 사원 번호
     * @return 사용자에게 맞춤화된 채팅방 정보
     */
    public ChatRoomDTO getRoomInfoForUser(int roomSeq, int empSeq) {
        ChatRoomDTO room = chatRoomDAO.getRoomById(roomSeq, empSeq);

        HashMap<String, Object> otherUserInfo = chatRoomDAO.getOtherUserInRoom(roomSeq, empSeq);
        String empName = (String) otherUserInfo.get("CUSTOM_ROOM_NAME");
        String empAvatar = (String) otherUserInfo.get("CUSTOM_ROOM_AVATAR");

        ChatRoomDTO roomForUser = new ChatRoomDTO(room);
        roomForUser.setRoomName(empName);
        roomForUser.setRoomAvatar(empAvatar);

        return roomForUser;
    }

    /**
     * 그룹 채팅방을 생성하고 참가자를 추가하는 메서드
     * 
     * @param roomName          생성할 채팅방 이름
     * @param creatorSeq        채팅방을 생성하는 사용자의 사원 번호
     * @param participantSeqs   그룹 채팅방에 추가할 사용자들의 사원 번호 리스트
     * @param participantDetails 참가자들에 대한 추가 정보 (예: 아바타)
     * @return 생성된 그룹 채팅방 정보
     */
    @Transactional
    public ChatRoomDTO createGroupRoom(String roomName, int creatorSeq, List<Integer> participantSeqs, List<Map<String, Object>> participantDetails) {
        ChatRoomDTO room = new ChatRoomDTO();
        room.setRoomName(roomName);
        room.setRoomType("group");
        room.setEmpSeq(creatorSeq);
        room.setRoomDescription("그룹 채팅방");

        String avatars = participantDetails.stream()
            .map(p -> p.get("avatar").toString())
            .collect(Collectors.joining(","));
        room.setRoomAvatar(avatars);

        chatRoomDAO.createGroupRoom(room);

        for (int empSeq : participantSeqs) {
            String role = (empSeq == creatorSeq) ? "ADMIN" : "MEMBER";
            chatRoomDAO.addGroupMember(room.getRoomSeq(), empSeq, role);
        }
        // chatRoomDAO.updateRoomInfo(room.getRoomSeq(), room);

        return room;
    }

    /**
     * 사용자가 채팅방에서 나가거나, 채팅방을 삭제하는 메서드
     * 
     * @param roomSeq 나가거나 삭제할 채팅방 번호
     * @param empSeq  나가는 사용자의 사원 번호
     */
    public void leaveChat(int roomSeq, int empSeq) {
        ChatRoomDTO room = chatRoomDAO.getRoomById(roomSeq, empSeq);
        if (room == null) {
            return;
        }

        if (room.getRoomType().equals("private")) {
            List<Integer> members = chatRoomDAO.getRoomMembers(roomSeq);
            for (int memberSeq : members) {
                chatRoomDAO.removeUserFromRoom(roomSeq, memberSeq);
                messagingTemplate.convertAndSendToUser(
                    String.valueOf(memberSeq),
                    "/queue/chatRoomDeleted",
                    roomSeq
                );
            }
            chatRoomDAO.deleteRoom(roomSeq);
        } else {
            chatRoomDAO.removeUserFromRoom(roomSeq, empSeq);
            EmployeeDTO user = chatProfileDAO.getEmployeeName(empSeq);
            if (user != null) {
                messagingTemplate.convertAndSend(
                    "/topic/room/" + roomSeq,
                    new ChatMessageDTO(roomSeq, user.getEmpName() + "님이 채팅방을 나갔습니다.", "LEAVE")
                );
            }
        }
    }

    /**
     * 특정 사용자의 채팅 기록을 삭제하는 메서드
     * 
     * @param roomSeq 채팅 기록을 삭제할 채팅방 번호
     * @param empSeq  채팅 기록을 삭제할 사용자의 사원 번호
     */
    public void clearChatHistory(int roomSeq, int empSeq) {
        chatRoomDAO.deleteChatHistory(roomSeq, empSeq);
    }

    /**
     * 특정 채팅방의 알림 설정을 토글하는 메서드
     * 
     * @param roomSeq 채팅방 번호
     * @param empSeq  알림 설정을 변경할 사용자의 사원 번호
     * @param enabled 알림 활성화 여부 (true: 활성화, false: 비활성화)
     */
    public void toggleNotifications(int roomSeq, int empSeq, boolean enabled) {
        String enabledStr = enabled ? "Y" : "N";
        chatRoomDAO.updateNotificationSettings(roomSeq, empSeq, enabledStr);
    }

    /**
     * 특정 사용자의 마지막 접속 시간을 업데이트하는 메서드
     * 
     * @param empSeq  사용자의 사원 번호
     * @param roomSeq 사용자가 접속한 채팅방 번호
     */
    public void updateLastAccessTime(int empSeq, int roomSeq) {
        chatRoomDAO.updateLastAccessTime(empSeq, roomSeq);
    }
}
