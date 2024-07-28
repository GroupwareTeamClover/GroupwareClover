package com.clover.messenger.dto;

import java.sql.Timestamp;

public class ChatRoomDTO {
    private int roomSeq;
    private String roomName;
    private String roomState;
    private Timestamp roomCreateTime;
    private String roomType;
    private String description;
    private int empSeq;


    public ChatRoomDTO() {}


    public ChatRoomDTO(int roomSeq, String roomName, String roomState, Timestamp roomCreateTime, String roomType, String description, int empSeq) {
        this.roomSeq = roomSeq;
        this.roomName = roomName;
        this.roomState = roomState;
        this.roomCreateTime = roomCreateTime;
        this.roomType = roomType;
        this.description = description;
        this.empSeq = empSeq;
    }


    public int getRoomSeq() { return roomSeq; }
    public void setRoomSeq(int roomSeq) { this.roomSeq = roomSeq; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getRoomState() { return roomState; }
    public void setRoomState(String roomState) { this.roomState = roomState; }

    public Timestamp getRoomCreateTime() { return roomCreateTime; }
    public void setRoomCreateTime(Timestamp roomCreateTime) { this.roomCreateTime = roomCreateTime; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getEmpSeq() { return empSeq; }
    public void setEmpSeq(int empSeq) { this.empSeq = empSeq; }
}