package com.clover.admin.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.admin.dto.AdminLogDTO;

@Repository
public class AdminLogDAO {

	@Autowired
	private SqlSession mybatis;
	
	public void insertLog(AdminLogDTO logdto) {
		mybatis.insert("AdminLog.insertLog", logdto);
	}
	
	public List<AdminLogDTO> getAllLog(){
		mybatis.selectList("AdminLog.getAllLog");
	}
}
