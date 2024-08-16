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
		
	
		//기안진행-총레코드 수
		public int getRecordTotalCount(int empSeq) {
		    return listDAO.getRecordTotalCount(empSeq);
		}
		
		//기안진행-페이지별 리스트
		public List<DocumentDTO> getFinishedPageDocuments(int empSeq, int start, int end) {
		   // MyBatis Mapper에게 start와 end 값을 넘겨 해당 페이지의 문서 리스트.
		   return listDAO.getFinishedPageDocuments(empSeq, start, end);
		}
}
