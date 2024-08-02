package com.clover.board.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.board.dto.BoardDTO;

@Repository
public class BoardDAO {
	@Autowired
	SqlSession mybatis;
	
	public void insertPost(BoardDTO post) {
		mybatis.insert("board.insertPost", post);
	}
	
	public List<BoardDTO> getPosts(int boardlistSeq){
		return mybatis.selectList("board.selectAllPost", boardlistSeq);
	}
	
	public List<BoardDTO> searchPosts(HashMap<String, Object> data){
		return mybatis.selectList("board.selectSearchedPost", data);
	}
}
