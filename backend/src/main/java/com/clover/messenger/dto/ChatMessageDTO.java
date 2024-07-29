package com.clover.messenger.dto;

import java.sql.Timestamp;

public class ChatMessageDTO {
    private int message_seq;
    private String message_content;
    private String message_type;
    private Timestamp send_time;
    private int room_seq;
    private int sender_seq;

    public ChatMessageDTO() {}


    public ChatMessageDTO(int message_seq, String message_content, String message_type, Timestamp send_time, int room_seq, int sender_seq) {
        this.message_seq = message_seq;;
        this.message_content = message_content;
        this.message_type = message_type;
        this.send_time = send_time;
        this.room_seq = room_seq;
        this.sender_seq = sender_seq;
    }

	public int getMessage_seq() {
		return this.message_seq;
	}

	public void setMessage_seq(int message_seq) {
		this.message_seq = message_seq;
	}

	public String getMessage_content() {
		return this.message_content;
	}

	public void setMessage_content(String message_content) {
		this.message_content = message_content;
	}

	public String getMessage_type() {
		return this.message_type;
	}

	public void setMessage_type(String message_type) {
		this.message_type = message_type;
	}

	public Timestamp getSend_time() {
		return this.send_time;
	}

	public void setSend_time(Timestamp send_time) {
		this.send_time = send_time;
	}

	public int getRoom_seq() {
		return this.room_seq;
	}

	public void setRoom_seq(int room_seq) {
		this.room_seq = room_seq;
	}

	public int getSender_seq() {
		return this.sender_seq;
	}

	public void setSender_seq(int sender_seq) {
		this.sender_seq = sender_seq;
	}


}