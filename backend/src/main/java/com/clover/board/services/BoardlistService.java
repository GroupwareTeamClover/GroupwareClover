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

	public List<String> getDeptList() {
		return blDao.selectAllDept();
	}

	public boolean validTitle(String title) {
		return blDao.validTitle(title);
	}

	public List<BoardlistDTO> getAllBoardList() {
		return blDao.getAllBoardList();
	}

	public List<BoardlistDTO> getGroupBoardList() {
		return blDao.getGroupBoardList();
	}

	public List<BoardlistDTO> getEntireBoardList() {
		return blDao.getEntireBoardList();
	}

	public List<Integer> getWhitelistMembers(int boardSeq) {
		return blDao.getWhitelistMembers(boardSeq);
	}

	public int createBoard(BoardlistDTO board, List<Integer> members) {
		blDao.createBoard(board);
		int newBoardSeq = board.getBoardlistSeq();

		if (!members.isEmpty()) {
			HashMap<String, Object> param = new HashMap<>();
			param.put("seq", newBoardSeq);
			param.put("members", members);

			blDao.createWhitelist(param);
		}
		return newBoardSeq;
	}

	public void deleteBoard(int seq) {
		blDao.deleteBoard(seq);
	}

	public void modifyBoard(BoardlistDTO board, List<Integer> members) {
		blDao.modifyBoard(board);
		
		if (board.getBoardlistType() == 'G') {
			blDao.deleteWhitelist(board.getBoardlistSeq());
			HashMap<String, Object> param = new HashMap<>();
			param.put("seq", board.getBoardlistSeq());
			param.put("members", members);
			blDao.createWhitelist(param);
		} else {
			blDao.deleteWhitelist(board.getBoardlistSeq());
		}
	}

	public BoardlistDTO getBoardInfo(int boardlistSeq) {
		return blDao.getBoardInfo(boardlistSeq);
	}
	
	public List<BoardlistDTO> getCategories(int empSeq){
		return blDao.getCategories(empSeq);
	}
}
