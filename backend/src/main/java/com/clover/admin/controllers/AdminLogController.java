package com.clover.admin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminLogDTO;
import com.clover.admin.dto.AdminLogSearchDTO;
import com.clover.admin.services.AdminLogService;
import com.github.pagehelper.PageInfo;

@RestController
@RequestMapping("/adminlog")
public class AdminLogController {

	@Autowired
	private AdminLogService adminlogService;
	
	@GetMapping
	public ResponseEntity<PageInfo<AdminLogDTO>> getAllLog(@RequestParam(defaultValue = "1") int page,
             @RequestParam(defaultValue = "10") int size) {
		System.out.println("log page = "+page);
		System.out.println("log size = " + size);
	return ResponseEntity.ok(adminlogService.getAllLog(page, size));
	}
	
	@GetMapping("/search")
    public ResponseEntity<PageInfo<AdminLogDTO>> getSearchLog(@RequestParam(defaultValue = "1") int page,
                                                              @RequestParam(defaultValue = "10") int size,
                                                              @RequestParam(required = false) String empName,
                                                              @RequestParam(required = false) String empId,
                                                              @RequestParam(required = false) String logStatus,
                                                              @RequestParam(required = false) String specificStartDate,
                                                              @RequestParam(required = false) String specificEndDate) {
        AdminLogSearchDTO logsearchdto = new AdminLogSearchDTO();
        logsearchdto.setEmpName(empName);
        logsearchdto.setEmpId(empId);
        logsearchdto.setLogStatus(logStatus);
        logsearchdto.setSpecificStartDate(specificStartDate);
        logsearchdto.setSpecificEndDate(specificEndDate);
        
        System.out.println("empId 는 ? " + empId);
        System.out.println("empName 는 ? " + empName);
        System.out.println("logStatus 는 ? " + logStatus);
        System.out.println("specificStartDate는?"+specificStartDate);
        System.out.println("specificEndDate?"+specificEndDate);
        return ResponseEntity.ok(adminlogService.getSearchLog(logsearchdto, page, size));
    }
	
//	@GetMapping
//	public ResponseEntity<List<AdminLogDTO>> getAllLog(){
//		return ResponseEntity.ok(adminlogService.getAllLog());
//	}
	
//	@GetMapping("/search")
//		public ResponseEntity<List<AdminLogDTO>> getSearchLog(String empName, String empId, String logStatus, 
//				String specificStartDate, String specificEndDate){
//		 AdminLogSearchDTO logsearchdto = new AdminLogSearchDTO();
//			 logsearchdto.setEmpName(empName);
//			 logsearchdto.setEmpId(empId);
//			 logsearchdto.setLogStatus(logStatus);
//	        logsearchdto.setSpecificStartDate(specificStartDate);
//	        logsearchdto.setSpecificEndDate(specificEndDate);
//	        
//	        System.out.println(logsearchdto.getEmpId() + logsearchdto.getLogStatus());
//
//		return ResponseEntity.ok(adminlogService.getSearchLog(logsearchdto));  // 돌려보낼거(list) 있음.
//	}
	
	
	
}
