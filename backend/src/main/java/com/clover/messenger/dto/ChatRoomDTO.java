package com.clover.messenger.dto;

import java.sql.Timestamp;

public class ChatRoomDTO {
    private int room_seq;
    private String room_name;
    private String room_state;
    private Timestamp room_create_time;
    private String room_type;
    private String room_description;
    private int emp_seq;

    public int getRoom_seq() {
        return this.room_seq;
    }

    public void setRoom_seq(int room_seq) {
        this.room_seq = room_seq;
    }

    public String getRoom_name() {
        return this.room_name;
    }

    public void setRoom_name(String room_name) {
        this.room_name = room_name;
    }

    public String getRoom_state() {
        return this.room_state;
    }

    public void setRoom_state(String room_state) {
        this.room_state = room_state;
    }

    public Timestamp getRoom_create_time() {
        return this.room_create_time;
    }

    public void setRoom_create_time(Timestamp room_create_time) {
        this.room_create_time = room_create_time;
    }

    public String getRoom_type() {
        return this.room_type;
    }

    public void setRoom_type(String room_type) {
        this.room_type = room_type;
    }

    public String getRoom_description() {
        return this.room_description;
    }

    public void setRoom_description(String room_description) {
        this.room_description = room_description;
    }

    public int getEmp_seq() {
        return this.emp_seq;
    }

    public void setEmp_seq(int emp_seq) {
        this.emp_seq = emp_seq;
    }


    public ChatRoomDTO() {}


    public ChatRoomDTO(int room_seq, String room_name, String room_state, Timestamp room_create_time, String room_type, String room_description, int emp_seq) {
        this.room_seq = room_seq;
        this.room_name = room_name;
        this.room_state = room_state;
        this.room_create_time = room_create_time;
        this.room_type = room_type;
        this.room_description = room_description;
        this.emp_seq = emp_seq;
    }


 
}