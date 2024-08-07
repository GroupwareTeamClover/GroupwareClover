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
		return mybatis.selectList("BoardList.selectAllMember");
	}
	
	public List<String> selectAllDept(){
		return mybatis.selectList("BoardList.selectAllDept");
	}
	
	public boolean validTitle(String title) {
		return mybatis.selectOne("BoardList.isTitleExist", title);
	}
	
	public List<BoardlistDTO> getAllBoardList(){
		return mybatis.selectList("BoardList.selectAllBoards");
	}
	
	public List<BoardlistDTO> getGroupBoardList(){
		return mybatis.selectList("BoardList.selectGroupBoards");
	}
	
	public List<BoardlistDTO> getEntireBoardList(){
		return mybatis.selectList("BoardList.selectEntireBoards");
	}
	
	public List<Integer> getWhitelistMembers(int boardSeq){
		return mybatis.selectList("BoardList.selectTargetWhitelistMembers", boardSeq);
	}
	
	public void createBoard(BoardlistDTO board) {
		mybatis.insert("BoardList.insertBoard", board);
	}
	
	public void createWhitelist(HashMap<String, Object> param) {
		mybatis.insert("BoardList.createWhitelist", param);
	}
	
	public void deleteBoard(int seq) {
		mybatis.delete("BoardList.deleteBoard", seq);
	}
	
	public void modifyBoard(BoardlistDTO board) {
		mybatis.update("BoardList.updateBoard", board);
	}
	
	public void deleteWhitelist(int boardSeq) {
		mybatis.delete("BoardList.deleteWhitelist", boardSeq);
	}
	
	public BoardlistDTO getBoardInfo(int boardSeq) {
		return mybatis.selectOne("BoardList.selectEachBoard", boardSeq);
	}
	
	public List<BoardlistDTO> getCategories(int empSeq){
		return mybatis.selectList("BoardList.selectIndividualBoard", empSeq);
	}
	
}
