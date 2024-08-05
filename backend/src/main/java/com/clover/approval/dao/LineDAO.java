package com.clover.approval.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.ParticipantsLineDTO;

@Repository
public class LineDAO {
	
	@Autowired
	private SqlSession mybatis;
	
	
	//모달에 직원정보 출력
	public List<Map<String, ?>> selectMemberInfo(){
		return mybatis.selectList("Document.selectMemberInfo");
	}
	
	//결재라인 insert
	public void insertApvLine(ApvLineDTO apvdto) {
		mybatis.insert("Line.insertApvLine", apvdto);
	}
	
	//참조자,열람자 insert
	public void insertPartLine(ParticipantsLineDTO pdto) {
		mybatis.insert("Line.insertPartLine", pdto);
	}
	
	

}

