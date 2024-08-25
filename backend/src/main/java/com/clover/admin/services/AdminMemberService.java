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
	
	public List<HashMap<String, Object>> getAllData(){
		return adminmemberDAO.getAllData();
	}
	public List<HashMap<String,Object>> getAllDept(){
		return adminmemberDAO.getAllDept();
	}
	public List<HashMap<String,Object>> getAllRole(){
		return adminmemberDAO.getAllRole();
	}
	public List<HashMap<String,Object>> getAllWork(){
		return adminmemberDAO.getAllWork();
	}
	public List<HashMap<String,Object>> getAllEmp(){
		return adminmemberDAO.getAllEmp();
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
	public List<HashMap<String,Object>> getAllNewName(){
		return adminmemberDAO.getAllNewName();
	}
	
	public void addMemState(AdminAddMemDTO adddto) {
		adminmemberDAO.addMem(adddto);
	}
	
	public void addDepartment(String deptName, String deptCode) {
		adminmemberDAO.addDepartment(deptName, deptCode);
	}
	
	public List<HashMap<String, Object>> getOrganization() {
        return adminmemberDAO.getOrganization();
    }
	
	
//	workerStateCode 0인지 아닌지 가져오기
	public EmployeeDTO getWorkerStateCode(int empSeq) {
		return adminmemberDAO.getWorkerStateCode(empSeq);
	}
	
}
