package com.clover.messenger.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.messenger.dao.ChatNotificationDAO;
import com.clover.messenger.dto.NotificationDTO;

@Service
public class ChatNotificationService {

    @Autowired
    private ChatNotificationDAO chatNotificationDAO;

    /**
     * 알림을 저장하는 메서드
     * @param notification 저장할 알림 정보
     */
    public void saveNotification(NotificationDTO notification) {
        chatNotificationDAO.saveNotification(notification);
    }

    /**
     * 알림 목록을 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 알림 목록
     */
    public List<NotificationDTO> getNotifications(int empSeq) {
        return chatNotificationDAO.getNotifications(empSeq);
    }

    /**
     * 알림을 읽음 처리하는s 메서드
     * @param notificationSeq 알림 번호
     */
    public void markNotificationAsRead(int notificationSeq) {
        chatNotificationDAO.markNotificationAsRead(notificationSeq);
    }
}
