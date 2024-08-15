package com.clover.approval.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.approval.dao.ListDAO;

@Service
public class ListService {
		@Autowired
		public ListDAO listDAO;
		
		//기안진행 리스트 전체 갯수
		public int getAllProgressCount(int empSeq) {
			return listDAO.getAllProgressCount(empSeq);
		}
}
