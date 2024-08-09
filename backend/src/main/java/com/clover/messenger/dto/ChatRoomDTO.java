package com.clover.messenger.dto;

import java.sql.Timestamp;
import java.util.List;
import java.util.ArrayList;
import com.clover.employee.dto.EmployeeDTO;

public class ChatRoomDTO {
    private int roomSeq;
    private String roomName;
    private String roomState;
    private Timestamp roomCreateTime;
    private String roomType;
    private String roomDescription;
    private int empSeq;
    private List<EmployeeDTO> participants;
    private String roomAvatar;
    private String customRoomName;
    private String customRoomAvatar;
    private String lastMessage;
    private Timestamp lastMessageTime;
    private int unreadCount;

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

    public String getRoomAvatar() {
        return this.roomAvatar;
    }

    public void setRoomAvatar(String roomAvatar) {
        this.roomAvatar = roomAvatar;
    }

    public String getRoomName() {
        return this.roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getRoomState() {
        return this.roomState;
    }

    public void setRoomState(String roomState) {
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

    public int getEmpSeq() {
        return this.empSeq;
    }

    public void setEmpSeq(int empSeq) {
        this.empSeq = empSeq;
    }

    // 새로 추가된 필드에 대한 getter와 setter
    public String getCustomRoomName() {
        return this.customRoomName;
    }

    public void setCustomRoomName(String customRoomName) {
        this.customRoomName = customRoomName;
    }

    public String getCustomRoomAvatar() {
        return this.customRoomAvatar;
    }

    public void setCustomRoomAvatar(String customRoomAvatar) {
        this.customRoomAvatar = customRoomAvatar;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Timestamp getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(Timestamp lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public int getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }

    public ChatRoomDTO() {}

    public ChatRoomDTO(int roomSeq, String roomName, String roomState, Timestamp roomCreateTime, 
    String roomType, String roomDescription, int empSeq, String roomAvatar, 
    String customRoomName, String customRoomAvatar, String lastMessage, 
    Timestamp lastMessageTime, int unreadCount) {
        this.roomSeq = roomSeq;
        this.roomName = roomName;
        this.roomState = roomState;
        this.roomCreateTime = roomCreateTime;
        this.roomType = roomType;
        this.roomDescription = roomDescription;
        this.empSeq = empSeq;
        this.roomAvatar = roomAvatar;
        this.customRoomName = customRoomName;
        this.customRoomAvatar = customRoomAvatar;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.unreadCount = unreadCount;
        }

    public ChatRoomDTO(ChatRoomDTO other) {
        this.roomSeq = other.roomSeq;
        this.roomName = other.roomName;
        this.roomState = other.roomState;
        this.roomCreateTime = other.roomCreateTime;
        this.roomType = other.roomType;
        this.roomDescription = other.roomDescription;
        this.empSeq = other.empSeq;
        this.participants = other.participants != null ? new ArrayList<>(other.participants) : null;
        this.roomAvatar = other.roomAvatar;
        this.customRoomName = other.customRoomName;
        this.customRoomAvatar = other.customRoomAvatar;
        this.lastMessage = other.lastMessage;
        this.lastMessageTime = other.lastMessageTime;
        this.unreadCount = other.unreadCount;
    }
}