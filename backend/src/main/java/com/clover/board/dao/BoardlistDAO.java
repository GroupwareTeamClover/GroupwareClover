package com.clover.board.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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
	
}
