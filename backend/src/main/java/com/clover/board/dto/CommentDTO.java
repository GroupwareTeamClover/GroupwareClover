package com.clover.board.dto;

import java.sql.Timestamp;

public class CommentDTO {
	private int boardCommentSeq;
	private String boardCommentWriter;
	private String boardCommentContent;
	private Timestamp boardCommentWriteDate;
	private int boardSeq;
	private int boardCommentReplySeq;
	
	public CommentDTO() {
		super();
	}
	public CommentDTO(int boardCommentSeq, String boardCommentWriter, String boardCommentContent,
			Timestamp boardCommentWriteDate, int boardSeq, int boardCommentReplySeq) {
		super();
		this.boardCommentSeq = boardCommentSeq;
		this.boardCommentWriter = boardCommentWriter;
		this.boardCommentContent = boardCommentContent;
		this.boardCommentWriteDate = boardCommentWriteDate;
		this.boardSeq = boardSeq;
		this.boardCommentReplySeq = boardCommentReplySeq;
	}
	public int getBoardCommentSeq() {
		return boardCommentSeq;
	}
	public void setBoardCommentSeq(int boardCommentSeq) {
		this.boardCommentSeq = boardCommentSeq;
	}
	public String getBoardCommentWriter() {
		return boardCommentWriter;
	}
	public void setBoardCommentWriter(String boardCommentWriter) {
		this.boardCommentWriter = boardCommentWriter;
	}
	public String getBoardCommentContent() {
		return boardCommentContent;
	}
	public void setBoardCommentContent(String boardCommentContent) {
		this.boardCommentContent = boardCommentContent;
	}
	public Timestamp getBoardCommentWriteDate() {
		return boardCommentWriteDate;
	}
	public void setBoardCommentWriteDate(Timestamp boardCommentWriteDate) {
		this.boardCommentWriteDate = boardCommentWriteDate;
	}
	public int getBoardSeq() {
		return boardSeq;
	}
	public void setBoardSeq(int boardSeq) {
		this.boardSeq = boardSeq;
	}
	public int getBoardCommentReplySeq() {
		return boardCommentReplySeq;
	}
	public void setBoardCommentReplySeq(int boardCommentReplySeq) {
		this.boardCommentReplySeq = boardCommentReplySeq;
	}
}
