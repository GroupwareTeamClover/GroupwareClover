package com.clover.admin.services;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.admin.dao.AdminMemberDAO;
import com.clover.admin.dto.AdminAddMemDTO;
import com.clover.admin.dto.AdminUpdateMemDTO;
import com.clover.employee.dto.EmployeeDTO;

@Service
public class AdminMemberService {
	
	@Autowired
	private AdminMemberDAO adminmemberDAO;
	
	public List<EmployeeDTO> getAllData(){
		return adminmemberDAO.getAllData();
	}
	
	public List<HashMap<String,Object>> getCountMem(){
		return adminmemberDAO.getCountMem();
	}
	public List<HashMap<String,Object>> getGender(){
		return adminmemberDAO.getGender();
	}
	public List<HashMap<String,Object>> getWorker(){
		return adminmemberDAO.getWorker();
	}
	public List<HashMap<String,Object>> getNewMonth(){
		return adminmemberDAO.getNewMonth();
	}
	public List<EmployeeDTO> getExit(){
		return adminmemberDAO.getExit();
	}
	public List<HashMap<String,Object>> getDept(){
		return adminmemberDAO.getDept();
	}
	
	public void updateMemState(AdminUpdateMemDTO updto) {
		adminmemberDAO.updateMem(updto);		
	}
	
	
	public List<EmployeeDTO> getAllNew(){
		return adminmemberDAO.getAllNew();
	}
	public void addMemState(AdminAddMemDTO adddto) {
		adminmemberDAO.addMem(adddto);
	}
	
}
