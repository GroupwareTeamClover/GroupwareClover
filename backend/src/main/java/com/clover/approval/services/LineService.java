package com.clover.approval.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clover.approval.dao.DocumentDAO;
import com.clover.approval.dao.LineDAO;
import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.ParticipantsLineDTO;

@Service
public class LineService {
	@Autowired
	private LineDAO lineDAO;
	
	@Autowired
	private DocumentDAO documentDAO;
	
	//모달에서 결재라인 선택 시 라인정보 받아오기
	public List<Map<String,?>> getMemberInfo(int seq){
		return lineDAO.selectMemberInfo(seq);
	}
	
	//디테일페이지에 결재라인정보출력하기
	public List<ApvLineDTO> getLineBySeq(int seq){
		return lineDAO.selectLineBySeq(seq);
	}
	
	//디테일페이지에 참조,열람라인정보출력하기
	public List<ParticipantsLineDTO> getPartBySeq(int seq){
		return lineDAO.selectPartBySeq(seq);
	}
	
	//리스트페이지에 결재라인 전체 정보출력하기
	public List<ApvLineDTO> getAllApv(){
		return lineDAO.selectAllApv();
	}
	
	//리스트페이지에 참조,열람라인 전체 정보 출력하기
	public List<ParticipantsLineDTO> getAllPart(){
		return lineDAO.selectAllPart();
	}
	
	//결재상태업데이트 함수들
	//대기->결재
	@Transactional
	public void updateWaitToApproval(int cleanApvLineSeq, int id) {
		lineDAO.updateWaitToApproval(cleanApvLineSeq);
		documentDAO.updateDocToApproval(id);
	}
	
	//대기->반려
	@Transactional
	public void updateWaitToReject(int id, int lineSeq, String reasonForRejection) {
		lineDAO.updateWaitToReject(lineSeq, reasonForRejection);
		documentDAO.updateDocToReject(id);
	}
	
	//대기->보류
	public void updateWaitToHoldoff(int lineSeq) {
		lineDAO.updateWaitToHoldoff(lineSeq);
	}

}
