package com.clover.messenger.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dao.ChatMessageDAO;
import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageDAO chatMessageDAO;

    @Autowired
    private ChatProfileService chatProfileService;

        @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


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
        updateUnreadMessageCount(message.getRoomSeq(), message.getSenderSeq());
        return message;
    }

    public void updateUnreadMessageCount(int roomSeq, int senderSeq) {
        List<Integer> roomMembers = chatRoomService.getRoomMembers(roomSeq);
        for (Integer memberSeq : roomMembers) {
            if (!memberSeq.equals(senderSeq)) {
                int unreadCount = chatMessageDAO.getUnreadMessageCount(roomSeq, memberSeq);
                messagingTemplate.convertAndSendToUser(
                    String.valueOf(memberSeq),
                    "/queue/unread",
                    Map.of("roomSeq", roomSeq, "unreadCount", unreadCount)
                );
            }
        }
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

    // @Transactional
    // public void markMessagesAsRead(int roomSeq, int empSeq) {
    //     int lastMessageSeq = chatMessageDAO.getLastMessageSeq(roomSeq);
    //     chatMessageDAO.updateLastReadMessage(empSeq, roomSeq, lastMessageSeq);
    //     updateUnreadMessageCount(roomSeq, empSeq);
    
    //     // 모든 사용자에게 읽지 않은 메시지 수 업데이트 전송
    //     List<Integer> roomMembers = chatRoomService.getRoomMembers(roomSeq);
    //     for (Integer memberSeq : roomMembers) {
    //         if (!memberSeq.equals(empSeq)) {
    //             int unreadCount = getUnreadMessageCount(roomSeq, memberSeq);
    //             messagingTemplate.convertAndSend("/topic/room/" + roomSeq + "/unreadCountUpdate",
    //                     Map.of("roomSeq", roomSeq, "unreadCount", unreadCount));
    //         }
    //     }
    // }
    @Transactional
    public void markMessagesAsRead(int roomSeq, int empSeq) {
        ChatRoomDTO room = chatRoomService.getRoomInfoForUser(roomSeq, empSeq);
        int lastMessageSeq = chatMessageDAO.getLastMessageSeq(roomSeq);
        chatMessageDAO.updateLastReadMessage(empSeq, roomSeq, lastMessageSeq);

        if ("group".equals(room.getRoomType())) {
            updateGroupMessageReadStatus(roomSeq, empSeq, lastMessageSeq);
        }

        updateUnreadMessageCount(roomSeq, empSeq);
    }

    private void updateGroupMessageReadStatus(int roomSeq, int empSeq, int lastMessageSeq) {
        List<ChatMessageDTO> unreadMessages = chatMessageDAO.getUnreadMessages(roomSeq, empSeq, lastMessageSeq);
        for (ChatMessageDTO message : unreadMessages) {
            chatMessageDAO.markMessageAsReadByUser(message.getMessageSeq(), empSeq);
            int unreadCount = chatRoomService.getRoomMembers(roomSeq).size() - chatMessageDAO.getReadUserCount(message.getMessageSeq());
            messagingTemplate.convertAndSend("/topic/room/" + roomSeq + "/messageUpdate",
                    Map.of("messageSeq", message.getMessageSeq(), "unreadCount", unreadCount));
        }
    }
}
