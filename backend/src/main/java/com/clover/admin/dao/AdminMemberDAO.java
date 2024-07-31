package com.clover.admin.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.admin.dto.AdminUpdateMemDTO;

@Repository
public class AdminMemberDAO {
	
	@Autowired
	private SqlSession mybatis;
	
	public List<HashMap<String, Object>> getAllData(){
		return mybatis.selectList("AdminMember.getAllData");
	}
	
	public List<HashMap<String, Object>> getCountMem(){
		return mybatis.selectList("AdminMember.getCountMem");
	}
	
	public void updateMem(AdminUpdateMemDTO updto) {
		Map<String, Object> params = new HashMap<>();
		
		for(int empSeq : updto.getEmpSeqList()) {
			params.put("tbObject", updto.getUpdateMems());
			params.put("newValue", updto.getNewValue());
			params.put("empSeq", empSeq);
			System.out.println("확인용 :"+ params.get("tbObject"));
			System.out.println("String: "+ params.get("newValue"));
			mybatis.update("AdminMember.updateMem", params);
		}
	}
	
}
