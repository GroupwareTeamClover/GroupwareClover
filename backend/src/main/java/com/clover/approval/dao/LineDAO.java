package com.clover.approval.dao;

import java.util.HashMap;
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
	public List<Map<String, ?>> selectMemberInfo(int seq){
		return mybatis.selectList("Line.selectMemberInfo",seq);
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
	
	//전체 출력
	public List<ApvLineDTO> selectAllApv(){
		return mybatis.selectList("Line.selectAllApv");
	}
	
	
	//참조자, 열람자 select
	public List<ParticipantsLineDTO> selectAllPart(){
		return mybatis.selectList("Line.selectAllPart");
	}
	
	//결재상태업데이트 함수들
	//대기->결재
	public void updateWaitToApproval(int id) {
		mybatis.update("Line.updateWaitToApproval", id);
	}

}

