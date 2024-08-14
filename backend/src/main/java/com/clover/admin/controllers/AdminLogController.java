package com.clover.admin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminLogDTO;
import com.clover.admin.dto.AdminLogSearchDTO;
import com.clover.admin.services.AdminLogService;

@RestController
@RequestMapping("/adminlog")
public class AdminLogController {

	@Autowired
	private AdminLogService adminlogService;
	
	@GetMapping
	public ResponseEntity<List<AdminLogDTO>> getAllLog(){
		return ResponseEntity.ok(adminlogService.getAllLog());
	}
	
	@GetMapping("/search")
		public ResponseEntity<List<AdminLogDTO>> getSearchLog(String empName, String empId, String logStatus, 
				String specificStartDate, String specificEndDate){
		 AdminLogSearchDTO logsearchdto = new AdminLogSearchDTO();
			 logsearchdto.setEmpName(empName);
			 logsearchdto.setEmpId(empId);
			 logsearchdto.setLogStatus(logStatus);
	        logsearchdto.setSpecificStartDate(specificStartDate);
	        logsearchdto.setSpecificEndDate(specificEndDate);
	        
	        System.out.println(logsearchdto.getEmpId() + logsearchdto.getLogStatus());

		return ResponseEntity.ok(adminlogService.getSearchLog(logsearchdto));  // 돌려보낼거(list) 있음.
	       
	       
	}
	
	
}
