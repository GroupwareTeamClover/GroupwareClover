package com.clover.board.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.board.dao.CommentDAO;
import com.clover.board.dto.CommentDTO;

@Service
public class CommentService {
	@Autowired
	private CommentDAO cDao;
	
	public int postComment(CommentDTO comment) {
		cDao.postComment(comment);
		int newCommentSeq = comment.getBoardCommentSeq();
		
		return newCommentSeq;
	}
	
	public int postReply(CommentDTO reply) {
		cDao.postReply(reply);
		int newReplySeq = reply.getBoardCommentSeq();
		
		return newReplySeq;
	}
	
	public List<CommentDTO> getComments(int boardSeq){
		return cDao.getComments(boardSeq);
	}
	
	public CommentDTO getEachComment(int seq) {
		return cDao.getEachComment(seq);
	}
	
	public void deleteComment(int commentSeq) {
		cDao.deleteComment(commentSeq);
	}
	
	public void deleteDefendencyReples(int commentSeq) {
		cDao.deleteDefendencyReples(commentSeq);
	}
	
	public void deleteReply(int replySeq) {
		cDao.deleteReply(replySeq);
	}
	
	public void modifyComment(CommentDTO comment) {
		cDao.modifyComment(comment);
	}
}
