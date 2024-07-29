package com.clover.board.dto;

public class BoardlistDTO {
	private int boardlistSeq;
	private String boardlistName;
	private char boardlistType;
	private char boardlistActive;
	
	public BoardlistDTO() {
		super();
	}
	public BoardlistDTO(int boardlistSeq, String boardlistName, char boardlistType, char boardlistActive) {
		super();
		this.boardlistSeq = boardlistSeq;
		this.boardlistName = boardlistName;
		this.boardlistType = boardlistType;
		this.boardlistActive = boardlistActive;
	}
	public int getBoardlistSeq() {
		return boardlistSeq;
	}
	public void setBoardlistSeq(int boardlistSeq) {
		this.boardlistSeq = boardlistSeq;
	}
	public String getBoardlistName() {
		return boardlistName;
	}
	public void setBoardlistName(String boardlistName) {
		this.boardlistName = boardlistName;
	}
	public char getBoardlistType() {
		return boardlistType;
	}
	public void setBoardlistType(char boardlistType) {
		this.boardlistType = boardlistType;
	}
	public char getBoardlistActive() {
		return boardlistActive;
	}
	public void setBoardlistActive(char boardlistActive) {
		this.boardlistActive = boardlistActive;
	}
}
