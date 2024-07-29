package com.clover.board.services;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.board.dao.BoardlistDAO;
import com.clover.board.dao.TestBoardListDAO;

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
	
}
