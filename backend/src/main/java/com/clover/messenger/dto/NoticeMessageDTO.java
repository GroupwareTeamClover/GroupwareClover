package com.clover.messenger.dto;


public class NoticeMessageDTO {
    private String content;
    private int senderSeq;
    private String senderName;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getSenderSeq() {
        return senderSeq;
    }

    public void setSenderSeq(int senderSeq) {
        this.senderSeq = senderSeq;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }


    // Constructor
    public NoticeMessageDTO() {

    }

    public NoticeMessageDTO(String content, int senderSeq, String senderName) {
        this.content = content;
        this.senderSeq = senderSeq;
        this.senderName = senderName;
    }

    @Override
    public String toString() {
        return "NoticeMessageDTO{" +
                "content='" + content + '\'' +
                ", senderSeq=" + senderSeq +
                ", senderName='" + senderName + '\'' +                
                '}';
    }
}