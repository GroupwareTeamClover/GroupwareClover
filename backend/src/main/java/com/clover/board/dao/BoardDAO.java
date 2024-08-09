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
		mybatis.insert("Board.insertPost", post);
	}
	
	public HashMap<String, String> getWriterInfo(String writer) {
		return mybatis.selectOne("Board.selectWriterInfo", writer);
	}
	
	public List<BoardDTO> getPosts(int boardlistSeq){
		return mybatis.selectList("Board.selectAllPost", boardlistSeq);
	}
	
	public List<BoardDTO> searchPosts(HashMap<String, Object> data){
		return mybatis.selectList("Board.selectSearchedPost", data);
	}
	
	public BoardDTO getPostInfo(int boardSeq) {
		return mybatis.selectOne("Board.selectTargetPost", boardSeq);
	}
	
	public void deletePost(int boardSeq) {
		mybatis.delete("Board.deletePost", boardSeq);
	}
	
	public void modifyPost(BoardDTO post) {
		mybatis.update("Board.updatePost", post);
	}
	
	public void upView(int boardSeq) {
		mybatis.update("Board.increaseViewCount", boardSeq);
	}
	
	public void addImportant(int empSeq, int boardSeq) {
		HashMap<String, Integer> data = new HashMap<>();
		data.put("empSeq", empSeq);
		data.put("boardSeq", boardSeq);
		
		mybatis.insert("Board.addImportant", data);
	}
	
	public void removeImportant(int empSeq, int boardSeq) {
		HashMap<String, Integer> data = new HashMap<>();
		data.put("empSeq", empSeq);
		data.put("boardSeq", boardSeq);
		
		mybatis.insert("Board.removeImportant", data);
	}
	
	public List<BoardDTO> getImportantPosts(int empSeq){
		return mybatis.selectList("Board.selectImportantPosts", empSeq);
	}
	
	public boolean isImportant(int empSeq, int boardSeq) {
		HashMap<String, Integer> data = new HashMap<>();
		data.put("empSeq", empSeq);
		data.put("boardSeq", boardSeq);
		
		return mybatis.selectOne("Board.isImportant", data);
	}
}
