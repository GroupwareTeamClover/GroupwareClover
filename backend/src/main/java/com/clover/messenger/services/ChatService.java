package com.clover.messenger.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dao.ChatDAO;
import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;

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

    /**
     * 1:1 채팅방을 생성하는 메서드
     * @param empSeq 채팅방을 생성하는 사용자의 사원 번호
     * @param targetEmpSeq 대화 상대방의 사원 번호
     * @return 생성된 채팅방 정보
     */
     // issue : ChatMembers의 데이터가 너무 커질 우려가 있다. 생각해봐야 함.
    @Transactional
    public ChatRoomDTO createOneToOneRoom(int empSeq, int targetEmpSeq) {
        ChatRoomDTO room = new ChatRoomDTO();
        room.setRoomName("1:1 채팅");
        room.setRoomType("private");
        room.setRoomState("T");
        room.setEmpSeq(empSeq);

        chatDAO.createRoom(room);
        chatDAO.addUserToRoom(empSeq, room.getRoomSeq());
        chatDAO.addUserToRoom(targetEmpSeq, room.getRoomSeq());

        return room;
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
     */
    @Transactional
    public void saveMessage(ChatMessageDTO message) {
        chatDAO.saveMessage(message);
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
}