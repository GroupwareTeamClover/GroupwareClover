package com.clover.messenger.dto;

public class ReadMessageDTO {
    private int roomSeq;
    private int messageSeq;
    private int empSeq;

    public int getRoomSeq() {
        return roomSeq;
    }

    public void setRoomSeq(int roomSeq) {
        this.roomSeq = roomSeq;
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

    public ReadMessageDTO() {}

    public ReadMessageDTO(int roomSeq, int messageSeq, int empSeq) {
        this.roomSeq = roomSeq;
        this.messageSeq = messageSeq;
        this.empSeq = empSeq;
    }

    @Override
    public String toString() {
        return "ReadMessageDTO{" +
                "roomSeq=" + roomSeq +
                ", messageSeq=" + messageSeq +
                ", empSeq=" + empSeq +
                '}';
    }
}