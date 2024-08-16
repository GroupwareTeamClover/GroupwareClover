package com.clover.admin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.admin.dao.AdminLogDAO;
import com.clover.admin.dto.AdminLogDTO;
import com.clover.admin.dto.AdminLogSearchDTO;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

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
	
//	public List<AdminLogDTO> getAllLog(){
//		return adminlogDAO.getAllLog();
//	}
	public PageInfo<AdminLogDTO> getAllLog(int page, int size){
		PageHelper.orderBy("log_seq desc");
		PageHelper.startPage(page,size);			// 그 뒤에 실행되는 쿼리에 자동 페이지네이션 적용됨. 
		List<AdminLogDTO> logs = adminlogDAO.getAllLog();
		return new PageInfo<>(logs);			// PageInfo 객체는 페이지 정보랑 함께 데이터가 반환됨. 
	}
	
//	public List<AdminLogDTO>  getSearchLog(AdminLogSearchDTO logsearchdto){
//		return adminlogDAO.getSearchLog(logsearchdto);
//	}
	public PageInfo<AdminLogDTO> getSearchLog(AdminLogSearchDTO logsearchdto, int page, int size) {
		
        PageHelper.startPage(page, size);
        List<AdminLogDTO> logs = adminlogDAO.getSearchLog(logsearchdto);
        return new PageInfo<>(logs);
    }
}

