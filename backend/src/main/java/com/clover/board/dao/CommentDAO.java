package com.clover.board.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.board.dto.CommentDTO;

@Repository
public class CommentDAO {
	@Autowired
	SqlSession mybatis;
	
	public void postComment(CommentDTO comment) {
		mybatis.insert("Comment.insertComment", comment);
	}
	
	public void postReply(CommentDTO reply) {
		mybatis.insert("Comment.insertReply", reply);
	}
	
	public List<CommentDTO> getComments(int boardSeq){
		return mybatis.selectList("Comment.selectAllComment", boardSeq);
	}
	
	public CommentDTO getEachComment(int seq) {
		return mybatis.selectOne("Comment.selectComment", seq);
	}
	
	public void deleteComment(int commentSeq) {
		mybatis.delete("Comment.deleteComment", commentSeq);
	}
	
	public void deleteDefendencyReples(int commentSeq) {
		mybatis.delete("Comment.deleteDefendencyReples", commentSeq);
	}
	
	public void deleteReply(int replySeq) {
		mybatis.delete("Comment.deleteReply", replySeq);
	}
	
	public void modifyComment(CommentDTO comment) {
		mybatis.update("Comment.updateComment", comment);
	}
}
