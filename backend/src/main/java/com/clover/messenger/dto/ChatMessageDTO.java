package com.clover.messenger.dto;

import java.sql.Timestamp;

public class ChatMessageDTO {
    private int messageSeq;
    private String messageContent;
    private String messageType;
    private String userConfirm;
    private Timestamp sendTime;
    private int roomSeq;
    private int senderSeq;


    public ChatMessageDTO() {}


    public ChatMessageDTO(int messageSeq, String messageContent, String messageType, String userConfirm, Timestamp sendTime, int roomSeq, int senderSeq) {
        this.messageSeq = messageSeq;
        this.messageContent = messageContent;
        this.messageType = messageType;
        this.userConfirm = userConfirm;
        this.sendTime = sendTime;
        this.roomSeq = roomSeq;
        this.senderSeq = senderSeq;
    }


    public int getMessageSeq() { return messageSeq; }
    public void setMessageSeq(int messageSeq) { this.messageSeq = messageSeq; }

    public String getMessageContent() { return messageContent; }
    public void setMessageContent(String messageContent) { this.messageContent = messageContent; }

    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }

    public String getUserConfirm() { return userConfirm; }
    public void setUserConfirm(String userConfirm) { this.userConfirm = userConfirm; }

    public Timestamp getSendTime() { return sendTime; }
    public void setSendTime(Timestamp sendTime) { this.sendTime = sendTime; }

    public int getRoomSeq() { return roomSeq; }
    public void setRoomSeq(int roomSeq) { this.roomSeq = roomSeq; }

    public int getSenderSeq() { return senderSeq; }
    public void setSenderSeq(int senderSeq) { this.senderSeq = senderSeq; }
}