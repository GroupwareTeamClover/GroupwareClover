package com.clover.board.dto;

import java.sql.Timestamp;

public class BoardDTO {
	private int boardSeq;
	private int boardlistSeq;
	private String boardTitle;
	private String boardWriter;
	private String boardContent;
	private Timestamp boardWriteDate;
	private int boardViewCount;
	
	public BoardDTO() {
		super();
	}
	public BoardDTO(int boardSeq, int boardlistSeq, String boardTitle, String boardWriter, String boardContent,
			Timestamp boardWriteDate, int boardViewCount) {
		super();
		this.boardSeq = boardSeq;
		this.boardlistSeq = boardlistSeq;
		this.boardTitle = boardTitle;
		this.boardWriter = boardWriter;
		this.boardContent = boardContent;
		this.boardWriteDate = boardWriteDate;
		this.boardViewCount = boardViewCount;
	}
	public int getBoardSeq() {
		return boardSeq;
	}
	public void setBoardSeq(int boardSeq) {
		this.boardSeq = boardSeq;
	}
	public int getBoardlistSeq() {
		return boardlistSeq;
	}
	public void setBoardlistSeq(int boardlistSeq) {
		this.boardlistSeq = boardlistSeq;
	}
	public String getBoardTitle() {
		return boardTitle;
	}
	public void setBoardTitle(String boardTitle) {
		this.boardTitle = boardTitle;
	}
	public String getBoardWriter() {
		return boardWriter;
	}
	public void setBoardWriter(String boardWriter) {
		this.boardWriter = boardWriter;
	}
	public String getBoardContent() {
		return boardContent;
	}
	public void setBoardContent(String boardContent) {
		this.boardContent = boardContent;
	}
	public Timestamp getBoardWriteDate() {
		return boardWriteDate;
	}
	public void setBoardWriteDate(Timestamp boardWriteDate) {
		this.boardWriteDate = boardWriteDate;
	}
	public int getBoardViewCount() {
		return boardViewCount;
	}
	public void setBoardViewCount(int boardViewCount) {
		this.boardViewCount = boardViewCount;
	}
}
