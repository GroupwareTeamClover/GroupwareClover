package com.clover.board.services;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clover.board.dao.BoardlistDAO;
import com.clover.board.dto.BoardlistDTO;

@Service
public class BoardlistService {
	
	@Autowired
	private BoardlistDAO blDao;
	
	public List<HashMap<String, Object>> getMemberList() {
		return blDao.selectAllMember();
	}
	
	public List<String> getDeptList(){
		return blDao.selectAllDept();
	}
	
	public boolean validTitle(String title) {
		return blDao.validTitle(title);
	}
	
	public List<BoardlistDTO> getAllBoardList(){
		return blDao.getAllBoardList();
	}
	
	public List<BoardlistDTO> getGroupBoardList(){
		return blDao.getGroupBoardList();
	}
	
	@Transactional
	public void createBoard(BoardlistDTO board, List<Integer> members) {
		blDao.createBoard(board);
		
		if(!members.isEmpty()) {
			int newBoardSeq = board.getBoardlistSeq();
			HashMap<String, Object> param = new HashMap<>();
			param.put("seq", newBoardSeq);
			param.put("members", members);
			
			blDao.createWhitelist(param);
		}
	}
	
}
