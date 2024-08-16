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
		
	
		//총레코드 수
		public int getRecordTotalCount(String type, int empSeq) {
			if(type.equals("기안문서함")) {
				return listDAO.getFinishedRecordTotalCount(empSeq);
			}else if(type.equals("임시문서함")) {
				return listDAO.getTempRecordTotalCount(empSeq);
			}else if(type.equals("결재문서함")) {
				return listDAO.getApprovalRecordTotalCount(empSeq);
			}else if(type.equals("참조/열람문서함")) {
				return listDAO.getPartRecordTotalCount(empSeq);
			}else {
				return 0;
			}
		}
		
		//페이지별 리스트
		public List<DocumentDTO> getPageDocuments(String type, int empSeq, int start, int end) {
			if(type.equals("기안문서함")) {
				 return listDAO.getFinishedPageDocuments(empSeq, start, end);
			}else if(type.equals("임시문서함")) {
				return listDAO.getTempPageDocuments(empSeq, start, end);
			}else if(type.equals("결재문서함")) {
				return listDAO.getApprovalPageDocuments(empSeq, start, end);
			}else if(type.equals("참조/열람문서함")) {
				return listDAO.getPartPageDocuments(empSeq, start, end);
			}else {
				return null;
			}
		  
		}
}
