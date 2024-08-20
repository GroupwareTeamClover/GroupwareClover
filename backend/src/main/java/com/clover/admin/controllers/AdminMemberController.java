package com.clover.admin.controllers;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminUpdateMemDTO;
import com.clover.admin.services.AdminMemberService;
import com.clover.employee.dto.EmployeeDTO;

@RestController
@RequestMapping("/adminmember")
public class AdminMemberController {

	@Autowired
	private AdminMemberService adminmemberService;
	
	
	@GetMapping
	public ResponseEntity<List<EmployeeDTO>> getAllData(){
		return ResponseEntity.ok(adminmemberService.getAllData());
	}
	@GetMapping("/countmem")
	public ResponseEntity<List<HashMap<String,Object>>> getCountMem(){
		return ResponseEntity.ok(adminmemberService.getCountMem());
	}
	
	@GetMapping("/gender")
	public ResponseEntity<List<HashMap<String,Object>>> getGender(){
		return ResponseEntity.ok(adminmemberService.getGender());
	}
	@GetMapping("/worker")
	public ResponseEntity<List<HashMap<String,Object>>> getWorker(){
		return ResponseEntity.ok(adminmemberService.getWorker());
	}
	@GetMapping("/countNewMonth")
	public ResponseEntity<List<HashMap<String,Object>>> getNewMonth(){
		return ResponseEntity.ok(adminmemberService.getNewMonth());
	}
	@GetMapping("/exit")
	public ResponseEntity<List<EmployeeDTO>> getExit(){
		return ResponseEntity.ok(adminmemberService.getExit());
	}
	@GetMapping("/deptCount")
	public ResponseEntity<List<HashMap<String,Object>>> getDept(){
		return ResponseEntity.ok(adminmemberService.getDept());
	}
	
	@PutMapping
	public ResponseEntity<Void> updateMultiMemState(@RequestBody AdminUpdateMemDTO updto){
		System.out.println(updto.getEmpSeqList());
		adminmemberService.updateMemState(updto);
		return ResponseEntity.ok().build();
	}
	
	
	
}
