package com.clover.messenger.dto;

import java.sql.Timestamp;
import java.util.List;
import com.clover.employee.dto.EmployeeDTO;

public class ChatRoomDTO {
    private int roomSeq;
    private String roomName;
    private char roomState;
    private Timestamp roomCreateTime;
    private String roomType;
    private String roomDescription;
    private Integer empSeq;
    private List<EmployeeDTO> participants;
    

    public List<EmployeeDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(List<EmployeeDTO> participants) {
        this.participants = participants;
    }   

    public int getRoomSeq() {
        return this.roomSeq;
    }

    public void setRoomSeq(int roomSeq) {
        this.roomSeq = roomSeq;
    }

    public String getRoomName() {
        return this.roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public char getRoomState() {
        return this.roomState;
    }

    public void setRoomState(char roomState) {
        this.roomState = roomState;
    }

    public Timestamp getRoomCreateTime() {
        return this.roomCreateTime;
    }

    public void setRoomCreateTime(Timestamp roomCreateTime) {
        this.roomCreateTime = roomCreateTime;
    }

    public String getRoomType() {
        return this.roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getRoomDescription() {
        return this.roomDescription;
    }

    public void setRoomDescription(String roomDescription) {
        this.roomDescription = roomDescription;
    }

    public Integer getEmpSeq() {
        return this.empSeq;
    }

    public void setEmpSeq(Integer empSeq) {
        this.empSeq = empSeq;
    }

    public ChatRoomDTO() {}

    public ChatRoomDTO(int roomSeq, String roomName, char roomState, Timestamp roomCreateTime, String roomType, String roomDescription, Integer empSeq) {
        this.roomSeq = roomSeq;
        this.roomName = roomName;
        this.roomState = roomState;
        this.roomCreateTime = roomCreateTime;
        this.roomType = roomType;
        this.roomDescription = roomDescription;
        this.empSeq = empSeq;
    }
}