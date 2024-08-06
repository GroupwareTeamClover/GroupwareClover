package com.clover.approval.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.approval.dao.LineDAO;
import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.ParticipantsLineDTO;
import com.clover.approval.dto.TotalLineEmpInfo;

@Service
public class LineService {
	@Autowired
	private LineDAO lineDAO;
	
	//모달에서 결재라인 선택 시 라인정보 받아오기
	public List<Map<String,?>> getMemberInfo(){
		return lineDAO.selectMemberInfo();
	}
	
	//디테일페이지에 결재라인정보출력하기
	public List<ApvLineDTO> getLineBySeq(int seq){
		return lineDAO.selectLineBySeq(seq);
	}
	
	//디테일페이지에 참조,열람라인정보출력하기
	public List<ParticipantsLineDTO> getPartBySeq(int seq){
		return lineDAO.selectPartBySeq(seq);
	}
	
//	//결재자, 참조자, 열람자 부서이름 직급 이름 
//	public List<TotalLineEmpInfo> getTotalLineEmpInfo(Map<String, Object> totalmap){
//			return lineDAO.selectTotalLineEmpInfo(totalmap);
//	}
		

}
