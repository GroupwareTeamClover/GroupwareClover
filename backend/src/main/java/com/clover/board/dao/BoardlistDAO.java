package com.clover.board.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.board.dto.BoardlistDTO;

@Repository
public class BoardlistDAO {

	@Autowired
	SqlSession mybatis;
	
	public List<HashMap<String, Object>> selectAllMember() {
		return mybatis.selectList("boardList.selectAllMember");
	}
	
	public List<String> selectAllDept(){
		return mybatis.selectList("boardList.selectAllDept");
	}
	
	public boolean validTitle(String title) {
		return mybatis.selectOne("boardList.isTitleExist", title);
	}
	
	public List<BoardlistDTO> getAllBoardList(){
		return mybatis.selectList("boardList.selectAllBoards");
	}
	
	public List<BoardlistDTO> getGroupBoardList(){
		return mybatis.selectList("boardList.selectGroupBoards");
	}
	
	public List<BoardlistDTO> getEntireBoardList(){
		return mybatis.selectList("boardList.selectEntireBoards");
	}
	
	public List<Integer> getWhitelistMembers(int boardSeq){
		return mybatis.selectList("boardList.selectTargetWhitelistMembers", boardSeq);
	}
	
	public void createBoard(BoardlistDTO board) {
		mybatis.insert("boardList.insertBoard", board);
	}
	
	public void createWhitelist(HashMap<String, Object> param) {
		mybatis.insert("boardList.createWhitelist", param);
	}
	
	public void deleteBoard(int seq) {
		mybatis.delete("boardList.deleteBoard", seq);
	}
	
	public void modifyBoard(BoardlistDTO board) {
		mybatis.update("boardList.updateBoard", board);
	}
	
	public void deleteWhitelist(int boardSeq) {
		mybatis.delete("boardList.deleteWhitelist", boardSeq);
	}
	
}
