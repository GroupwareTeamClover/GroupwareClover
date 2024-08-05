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
	
	public CommentDTO getEachComment(int commentSeq) {
		return mybatis.selectOne("comment.selectComment", commentSeq);
	}
	
	public CommentDTO getEachReply(int replySeq) {
		return mybatis.selectOne("comment.selectReply", replySeq);
	}
}
