package com.clover.messenger.dto;

import java.sql.Timestamp;

public class ChatMessageDTO {
    private int messageSeq;
    private String messageContent;
    private String messageType;
    private Timestamp sendTime;
    private int roomSeq;
    private int senderSeq;
    private String roomType;  
    private int receiverSeq;  


    public int getMessageSeq() {
        return messageSeq;
    }

    public void setMessageSeq(int messageSeq) {
        this.messageSeq = messageSeq;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType != null ? messageType : "CHAT"; // 기본 값 설정, text/image 등등으로 받아야함
    }

    public Timestamp getSendTime() {
        return sendTime;
    }

    public void setSendTime(Timestamp sendTime) {
        this.sendTime = sendTime;
    }

    public int getRoomSeq() {
        return roomSeq;
    }

    public void setRoomSeq(int roomSeq) {
        this.roomSeq = roomSeq;
    }

    public int getSenderSeq() {
        return senderSeq;
    }

    public void setSenderSeq(int senderSeq) {
        this.senderSeq = senderSeq;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public int getReceiverSeq() {
        return receiverSeq;
    }

    public void setReceiverSeq(int receiverSeq) {
        this.receiverSeq = receiverSeq;
    }


    public ChatMessageDTO() {}

    public ChatMessageDTO(int messageSeq, String messageContent, String messageType, Timestamp sendTime, int roomSeq, int senderSeq, String roomType, int receiverSeq) {
        this.messageSeq = messageSeq;
        this.messageContent = messageContent;
        this.messageType = messageType != null ? messageType : "CHAT"; // 기본 값 설정
        this.sendTime = sendTime;
        this.roomSeq = roomSeq;
        this.senderSeq = senderSeq;
        this.roomType = roomType;
        this.receiverSeq = receiverSeq;
    }

    public ChatMessageDTO(int roomSeq, String messageContent, String messageType) {
        this.roomSeq = roomSeq;
        this.messageContent = messageContent;
        this.messageType = messageType;
        this.sendTime = new Timestamp(System.currentTimeMillis());
    }


    @Override
    public String toString() {
        return "ChatMessageDTO{" +
                "messageSeq=" + messageSeq +
                ", messageContent='" + messageContent + '\'' +
                ", messageType='" + messageType + '\'' +
                ", sendTime=" + sendTime +
                ", roomSeq=" + roomSeq +
                ", senderSeq=" + senderSeq +
                ", roomType='" + roomType + '\'' +
                ", receiverSeq=" + receiverSeq +
                '}';
    }


}