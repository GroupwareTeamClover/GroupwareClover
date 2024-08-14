package com.clover.admin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.admin.dao.AdminLogDAO;
import com.clover.admin.dto.AdminLogDTO;
import com.clover.admin.dto.AdminLogSearchDTO;

@Service
public class AdminLogService {

	@Autowired
	private AdminLogDAO adminlogDAO;
	
	public void insertLog(AdminLogDTO logdto) {
	     System.out.println("로그인 시도: User ID = " + logdto.getEmpSeq()+ "& "+ logdto.getDeptCode()+ ", IP 주소 = " + logdto.getClientIp() + ", 상태 = " + logdto.getLogStatus());
	       System.out.println(
	    		   "ip "+  logdto.getClientIp() +" 시간 "+logdto.getLocalLogTime()+" 상태 "+logdto.getLogStatus() +" 사번"+logdto.getEmpSeq() +" 이름"+
	    		   logdto.getEmpName() +"아이디 "+ logdto.getEmpId() +" 부서코드 "+ logdto.getDeptCode()
	    		   );
	        adminlogDAO.insertLog(logdto);
	}
	
	public List<AdminLogDTO> getAllLog(){
		return adminlogDAO.getAllLog();
	}
	
	public List<AdminLogDTO>  getSearchLog(AdminLogSearchDTO logsearchdto){
		return adminlogDAO.getSearchLog(logsearchdto);
	}
}

