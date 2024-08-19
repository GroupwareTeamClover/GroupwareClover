package com.clover.messenger.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.messenger.dto.NotificationDTO;

@Repository
public class ChatNotificationDAO {

    @Autowired
    private SqlSession mybatis;

    /**
     * 알림을 저장하는 메서드
     * @param notification 저장할 알림 정보
     */
    public void saveNotification(NotificationDTO notification) {
        mybatis.insert("ChatNotificationMapper.saveNotification", notification);
    }

    /**
     * 알림 목록을 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 알림 목록
     */
    public List<NotificationDTO> getNotifications(int empSeq) {
        return mybatis.selectList("ChatNotificationMapper.getNotifications", empSeq);
    }

    /**
     * 알림을 읽음 처리하는 메서드
     * @param notificationSeq 알림 번호
     */
    public void markNotificationAsRead(int notificationSeq) {
        mybatis.update("ChatNotificationMapper.markNotificationAsRead", notificationSeq);
    }
}
