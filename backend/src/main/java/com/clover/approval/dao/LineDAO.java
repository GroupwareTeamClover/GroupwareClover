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
	
	//모달정보로 insert
	public void modalInsertApvLine(ApvLineDTO apvdto) {
		mybatis.insert("Line.modalInsertApvLine", apvdto);
	}
	
	//모달정보로 insert
	public void modalInsertPartLine(ParticipantsLineDTO pdto) {
		mybatis.insert("Line.modalInsertPartLine", pdto);
	}
	
	

}

