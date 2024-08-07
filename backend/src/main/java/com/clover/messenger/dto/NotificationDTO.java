package com.clover.messenger.dto;

import java.sql.Timestamp;

public class NotificationDTO {
    private int notificationSeq;
    private String notificationType;
    private boolean isRead;
    private Timestamp createDate;
    private int messageSeq;
    private int empSeq;

    public int getNotificationSeq() {
        return notificationSeq;
    }

    public void setNotificationSeq(int notificationSeq) {
        this.notificationSeq = notificationSeq;
    }

    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    public int getMessageSeq() {
        return messageSeq;
    }

    public void setMessageSeq(int messageSeq) {
        this.messageSeq = messageSeq;
    }

    public int getEmpSeq() {
        return empSeq;
    }

    public void setEmpSeq(int empSeq) {
        this.empSeq = empSeq;
    }


    public NotificationDTO() {
    }

    public NotificationDTO(int notificationSeq, String notificationType, boolean isRead, Timestamp createDate, int messageSeq, int empSeq) {
        this.notificationSeq = notificationSeq;
        this.notificationType = notificationType;
        this.isRead = isRead;
        this.createDate = createDate;
        this.messageSeq = messageSeq;
        this.empSeq = empSeq;
    }

    
    @Override
    public String toString() {
        return "NotificationDTO{" +
                "notificationSeq=" + notificationSeq +
                ", notificationType='" + notificationType + '\'' +
                ", isRead=" + isRead +
                ", createDate=" + createDate +
                ", messageSeq=" + messageSeq +
                ", empSeq=" + empSeq +
                '}';
    }
}