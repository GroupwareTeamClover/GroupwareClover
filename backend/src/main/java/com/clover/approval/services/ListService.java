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
		
		//기안진행-페이지별
		public List<DocumentDTO> getFinishedDocuments(int page, int size) {
		  int offset = (page - 1) * size;
		  return listDAO.getFinishedDocuments(offset, size);
		}
		//기안진행-총레코드 수
		public int getTotalFinishedDocumentsCount() {
		    return listDAO.getTotalFinishedDocumentsCount();
		}
}
