package com.clover.admin.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class AdminMemberDAO {
	
	@Autowired
	private SqlSession mybatis;
	
	public List<HashMap<String, Object>> getAllData(){
		return mybatis.selectList("AdminMember.getAllData");
	}
}
