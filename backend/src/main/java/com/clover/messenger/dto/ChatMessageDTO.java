package com.clover.messenger.dto;

import java.sql.Timestamp;

public class ChatMessageDTO {
    private int messageSeq;
    private String messageContent;
    private String messageType;
    private Timestamp sendTime;
    private int roomSeq;
    private int senderSeq;

    // Getters and setters
    public int getMessageSeq() {
        return this.messageSeq;
    }

    public void setMessageSeq(int messageSeq) {
        this.messageSeq = messageSeq;
    }

    public String getMessageContent() {
        return this.messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public String getMessageType() {
        return this.messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public Timestamp getSendTime() {
        return this.sendTime;
    }

    public void setSendTime(Timestamp sendTime) {
        this.sendTime = sendTime;
    }

    public int getRoomSeq() {
        return this.roomSeq;
    }

    public void setRoomSeq(int roomSeq) {
        this.roomSeq = roomSeq;
    }

    public int getSenderSeq() {
        return this.senderSeq;
    }

    public void setSenderSeq(int senderSeq) {
        this.senderSeq = senderSeq;
    }

    // Constructors
    public ChatMessageDTO() {}

    public ChatMessageDTO(int messageSeq, String messageContent, String messageType, Timestamp sendTime, int roomSeq, int senderSeq) {
        this.messageSeq = messageSeq;
        this.messageContent = messageContent;
        this.messageType = messageType;
        this.sendTime = sendTime;
        this.roomSeq = roomSeq;
        this.senderSeq = senderSeq;
    }
}