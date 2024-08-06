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
		mybatis.insert("comment.insertComment", comment);
	}
	
	public void postReply(CommentDTO reply) {
		mybatis.insert("comment.insertReply", reply);
	}
	
	public List<CommentDTO> getComments(int boardSeq){
		return mybatis.selectList("comment.selectAllComment", boardSeq);
	}
	
	public CommentDTO getEachComment(int seq) {
		return mybatis.selectOne("comment.selectComment", seq);
	}
	
	public void deleteComment(int commentSeq) {
		mybatis.delete("comment.deleteComment", commentSeq);
	}
	
	public void deleteDefendencyReples(int commentSeq) {
		mybatis.delete("comment.deleteDefendencyReples", commentSeq);
	}
	
	public void deleteReply(int replySeq) {
		mybatis.delete("comment.deleteReply", replySeq);
	}
	
	public void modifyComment(CommentDTO comment) {
		mybatis.update("comment.updateComment", comment);
	}
}
