package com.clover.approval.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.ParticipantsLineDTO;
import com.clover.approval.dto.TotalLineEmpInfo;

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
	
	//결재 라인 select
	public List<ApvLineDTO> selectLineBySeq(int seq){
		return mybatis.selectList("Line.selectApvLine", seq);
	}
	
	
	//참조자, 열람자 select
	public List<ParticipantsLineDTO> selectPartBySeq(int seq){
		return mybatis.selectList("Line.selectPartLine", seq);
	}
	
//	//결재자, 참조자, 열람자 부서이름 직급 이름 
//	public List<TotalLineEmpInfo> selectTotalLineEmpInfo(Map<String, Object> totalmap){
//		return mybatis.selectList("Line.selectTotalLineEmpInfo", totalmap);
//	}
//	

}

