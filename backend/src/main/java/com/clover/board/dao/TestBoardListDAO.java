package com.clover.board.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TestBoardListDAO {
	
	@Autowired
	SqlSession mybatis;
	
	public List<HashMap<String, Object>> selectAll() {
		return mybatis.selectList("testBoardList.selectAll");
	}
}
