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

    /**
     * 모든 채팅방 목록을 조회하는 메서드
     * @return 채팅방 목록
     */
    public List<ChatRoomDTO> getChatRooms() {
        return chatDAO.getChatRooms();
    }

    /**
     * 1:1 채팅방을 생성하는 메서드
     * @param empSeq 대화 상대방의 사원 번호
     * @return 생성된 채팅방 정보
     */
    // 사용하는 테이블 : ChatRoom, ChatMembers 
    // currentUserId는 대화방을 생성하는 당사자. 
    // 1:1 채팅방 생성하고 생성된 room의 seq를 addUserToRoom으로 chatMembers 에 보낸다.
    // issue : ChatMembers의 데이터가 너무 커질 우려가 있다. 생각해봐야 함.
    public ChatRoomDTO createOneToOneRoom(int empSeq) {
        // 로그인 아이디 가져오는 로직 필요 
        int currentUserId = getCurrentUserId();
        
        ChatRoomDTO room = new ChatRoomDTO();
        room.setRoomName("1:1 채팅");
        room.setRoomType("private");
        room.setRoomState("T");
        room.setEmpSeq(currentUserId);
        
        chatDAO.createRoom(room);
        chatDAO.addUserToRoom(currentUserId, room.getRoomSeq());
        chatDAO.addUserToRoom(empSeq, room.getRoomSeq());
        
        return room;
    }

    /**
     * 현재 로그인한 사용자의 ID를 가져오는 메서드
     * @return 현재 사용자의 ID
     */
    private int getCurrentUserId() {
        // 로그인 로직 구현 될 시 구현 예정
        return 1; // 임시 반환값
    }

    /**
     * 특정 채팅방의 메시지 목록을 가져오는 메서드
     * @param roomSeq 조회활 채팅방 번호
     * @return 채팅 메시지 목록
     */    
    public List<ChatMessageDTO> getRoomMessages(int roomSeq) {
        return chatDAO.getRoomMessages(roomSeq);
    }

    /**
     * 특정 채팅방을 조회하는 메서드
     * @param roomSeq 조회할 채팅방 번호
     * @return 조회된 채팅방 정보
     */        
    public ChatRoomDTO getRoomById(int roomSeq) {
        return chatDAO.getRoomById(roomSeq);
    }

    // 보류
    public boolean isUserInRoom(WebSocketSession session, int roomSeq) {
        String loginID = (String) session.getAttributes().get("loginID");
        if (loginID == null) {
            return false;
        }
        return chatDAO.isUserInRoom(Integer.parseInt(loginID), roomSeq);
    }

    /**
     * 어느 채팅방에 누가 속해있는지 저장하는 메서드
     * @param empSeq 채팅방에 속한 사번
     * @param roomSeq 선택된 채팅방 번호
     */
    @Transactional
    public void addUserToRoom(int empSeq, int roomSeq) {
        chatDAO.addUserToRoom(empSeq, roomSeq);
    }

    /**
     * 채팅방을 생성하는 메서드
     * @param room 생성된 채팅방 정보
     * @return 생성된 채팅방
     */      
    @Transactional
    public ChatRoomDTO createRoom(ChatRoomDTO room) {
        chatDAO.createRoom(room);
        return room;
    }

    /**
     * 메시지를 저장하는 메서드
     * @param message 채팅 메시지
     */      
    @Transactional
    public void saveMessage(ChatMessageDTO message) {
        chatDAO.saveMessage(message);
    }    
    
    
}