package com.clover.approval.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.approval.dao.ListDAO;
import com.clover.approval.dto.DocumentDTO;

@Service
public class ListService {
		@Autowired
		public ListDAO listDAO;
		
		//메인카드
		public List<DocumentDTO> getMainCard(int empSeq){
			return listDAO.getMainCard(empSeq);
		}
		
		//메인리스트
		public List<DocumentDTO> getMainList(int empSeq){
			return listDAO.getMainList(empSeq);
		}
	
		//총레코드 수
		public int getRecordTotalCount(String type, int empSeq, String searchType, String keyword) {
			if(type.equals("기안문서함")) {
				return listDAO.getFinishedRecordTotalCount(empSeq, searchType, keyword);
			}else if(type.equals("임시문서함")) {
				return listDAO.getTempRecordTotalCount(empSeq, searchType, keyword);
			}else if(type.equals("결재문서함")) {
				return listDAO.getApprovalRecordTotalCount(empSeq, searchType, keyword);
			}else if(type.equals("참조/열람문서함")) {
				return listDAO.getPartRecordTotalCount(empSeq, searchType, keyword);
			}else {
				return 0;
			}
		}
		
		//페이지별 리스트
		public List<DocumentDTO> getPageDocuments(String type, int empSeq, int start, int end, String searchType, String keyword) {
			if(type.equals("기안문서함")) {
				 return listDAO.getFinishedPageDocuments(empSeq, start, end, searchType, keyword);
			}else if(type.equals("임시문서함")) {
				return listDAO.getTempPageDocuments(empSeq, start, end, searchType, keyword);
			}else if(type.equals("결재문서함")) {
				return listDAO.getApprovalPageDocuments(empSeq, start, end, searchType, keyword);
			}else if(type.equals("참조/열람문서함")) {
				return listDAO.getPartPageDocuments(empSeq, start, end, searchType, keyword);
			}else {
				return null;
			}
		  
		}
}
