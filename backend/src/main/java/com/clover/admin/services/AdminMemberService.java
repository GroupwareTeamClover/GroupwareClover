package com.clover.admin.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.admin.dao.AdminMemberDAO;
import com.clover.admin.dto.AdminUpdateMemDTO;

@Service
public class AdminMemberService {
	
	@Autowired
	private AdminMemberDAO adminmemberDAO;
	
	public List<HashMap<String, Object>> getAllData(){
		return adminmemberDAO.getAllData();
	}
	
	public List<HashMap<String,Object>> getCountMem(){
		return adminmemberDAO.getCountMem();
	}
	
	public void updateMemState(AdminUpdateMemDTO updto) {
		adminmemberDAO.updateMem(updto);
//		Map<String, Object> tbObject = updto.getTbObject();
//		String newValue = updto.getNewValue();
//		for(int empSeq:updto.getEmpSeqList()) {
//			adminmemberDAO.updateMem(tbObject, newValue, empSeq);			
//		}
		
	}
	
}
