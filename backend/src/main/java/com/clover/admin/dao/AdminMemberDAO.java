package com.clover.admin.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.admin.dto.AdminAddMemDTO;
import com.clover.admin.dto.AdminUpdateMemDTO;
import com.clover.employee.dto.EmployeeDTO;

@Repository
public class AdminMemberDAO {
	
	@Autowired
	private SqlSession mybatis;
	
	public List<HashMap<String, Object>> getAllData(){
		return mybatis.selectList("AdminMember.getAllData");
	}
	public List<HashMap<String, Object>> getAllDept(){
		return mybatis.selectList("AdminMember.getAllDept");
	}
	public List<HashMap<String, Object>> getAllRole(){
		return mybatis.selectList("AdminMember.getAllRole");
	}
	public List<HashMap<String, Object>> getAllWork(){
		return mybatis.selectList("AdminMember.getAllWork");
	}
	public List<HashMap<String, Object>> getAllEmp(){
		return mybatis.selectList("AdminMember.getAllEmp");
	}
	
	
	
	public List<HashMap<String, Object>> getCountMem(){
		return mybatis.selectList("AdminMember.getCountMem");
	}
	public List<HashMap<String, Object>> getGender(){
		return mybatis.selectList("AdminMember.getGender");
	}
	public List<HashMap<String, Object>> getWorker(){
		return mybatis.selectList("AdminMember.getWorker");
	}
	public List<HashMap<String, Object>> getNewMonth(){
		return mybatis.selectList("AdminMember.getNewMonth");
	}
	public List<EmployeeDTO> getExit(){
		return mybatis.selectList("AdminMember.getExit");
	}
	public List<HashMap<String, Object>> getDept(){
		return mybatis.selectList("AdminMember.getDept");
	}
	
	public void updateMem(AdminUpdateMemDTO updto) {
		Map<String, Object> params = new HashMap<>();
		
		for(int empSeq : updto.getEmpSeqList()) {
			params.put("tbObject", updto.getUpdateMems());
			params.put("newValue", updto.getNewValue());
			params.put("empSeq", empSeq);
			
			// newValue가 퇴사일 경우 true로 설정
	        boolean isLeave = "퇴사".equals(updto.getNewValue());
	        params.put("isLeave", isLeave);
	        			
			mybatis.update("AdminMember.updateMem", params);
			
			// '퇴사'일 때 추가적인 leave_date 업데이트해주기.
	        if (isLeave) {
	            mybatis.update("AdminMember.updateLeaveDate", empSeq);
	        }
		}
	}
	
//	사원추가 - { 부서, 직위, 가입대기-> 재직중 } 3개 변경!!!
	public List<EmployeeDTO> getAllNew(){
		return mybatis.selectList("AdminMember.getAllNew");
	}
	public List<HashMap<String, Object>> getAllNewName(){
		return mybatis.selectList("AdminMember.getAllNewName");
	}
	
	public void addMem(AdminAddMemDTO adddto) {
		 Map<String, Object> params = new HashMap<>();
	        params.put("dept", adddto.getDept());
	        params.put("role", adddto.getRole());
	        params.put("worker_state", adddto.getWorker_state());

	        for (int empSeq : adddto.getEmpSeqList()) {
	            params.put("empSeq", empSeq);
	           
	            mybatis.update("AdminMember.addMem", params);
	        }
	}
	
	public void addDepartment(String deptName, String deptCode) {
		Map<String, Object> params = new HashMap<>();
		params.put("deptName", deptName);
		params.put("deptCode", deptCode);
		
		mybatis.insert("AdminMember.addDepartment", params);
	}
	
	
	public List<HashMap<String, Object>> getOrganization(){
		return mybatis.selectList("AdminMember.getOrganization");
	}    
	
	
	
}
