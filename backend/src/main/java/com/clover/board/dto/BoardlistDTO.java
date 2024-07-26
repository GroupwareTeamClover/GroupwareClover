package com.clover.board.dto;

public class BoardlistDTO {
	private int boardlist_seq;
	private String boardlist_name;
	private char boardlist_type;
	private char boardlist_active;
	
	public BoardlistDTO() {
		super();
	}
	public BoardlistDTO(int boardlist_seq, String boardlist_name, char boardlist_type, char boardlist_active) {
		super();
		this.boardlist_seq = boardlist_seq;
		this.boardlist_name = boardlist_name;
		this.boardlist_type = boardlist_type;
		this.boardlist_active = boardlist_active;
	}
	public int getBoardlist_seq() {
		return boardlist_seq;
	}
	public void setBoardlist_seq(int boardlist_seq) {
		this.boardlist_seq = boardlist_seq;
	}
	public String getBoardlist_name() {
		return boardlist_name;
	}
	public void setBoardlist_name(String boardlist_name) {
		this.boardlist_name = boardlist_name;
	}
	public char getBoardlist_type() {
		return boardlist_type;
	}
	public void setBoardlist_type(char boardlist_type) {
		this.boardlist_type = boardlist_type;
	}
	public char getBoardlist_active() {
		return boardlist_active;
	}
	public void setBoardlist_active(char boardlist_active) {
		this.boardlist_active = boardlist_active;
	}
}
