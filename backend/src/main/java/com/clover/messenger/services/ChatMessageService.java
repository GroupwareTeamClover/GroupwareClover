package com.clover.messenger.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dao.ChatMessageDAO;
import com.clover.messenger.dto.ChatMessageDTO;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageDAO chatMessageDAO;

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ChatProfileService chatProfileService;

    /**
     * 특정 채팅방의 메시지 목록을 가져오는 메서드
     * @param roomSeq 조회할 채팅방 번호
     * @param empSeq 조회하는 사용자의 사원 번호
     * @return 채팅 메시지 목록
     */
    public List<ChatMessageDTO> getRoomMessages(int roomSeq, int empSeq) {
        return chatMessageDAO.getRoomMessages(roomSeq, empSeq);
    }

    /**
     * 메시지를 저장하는 메서드
     * @param message 저장할 채팅 메시지
     * @return 저장된 채팅 메시지
     */
    @Transactional
    public ChatMessageDTO saveMessage(ChatMessageDTO message) {
        EmployeeDTO sender = chatProfileService.getEmployeeName(message.getSenderSeq());
        System.out.println(sender.getEmpName());
        System.out.println(sender.getEmpAvatar());
        message.setSenderName(sender.getEmpName());
        message.setSenderAvatar(sender.getEmpAvatar());

        chatMessageDAO.saveMessage(message);
        return message;
    }

    /**
     * 읽지 않은 메시지 수를 조회하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     * @return 읽지 않은 메시지 수
     */
    public int getUnreadMessageCount(int roomSeq, int empSeq) {
        return chatMessageDAO.getUnreadMessageCount(roomSeq, empSeq);
    }

    /**
     * 메시지를 읽음 처리하는 메서드
     * @param roomSeq 채팅방 번호
     * @param empSeq 사용자의 사원 번호
     * @param messageSeq 마지막으로 읽은 메시지 번호
     */
    public void updateLastReadMessage(int empSeq, int roomSeq, int messageSeq) {
        chatMessageDAO.updateLastReadMessage(empSeq, roomSeq, messageSeq);
    }

    @Transactional
    public void markMessagesAsRead(int roomSeq, int empSeq) {
        int lastMessageSeq = chatMessageDAO.getLastMessageSeq(roomSeq);
        chatMessageDAO.updateLastReadMessage(empSeq, roomSeq, lastMessageSeq);
    }
}
