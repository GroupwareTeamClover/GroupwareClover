package com.clover.admin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminAddMemDTO;
import com.clover.admin.services.AdminMemberService;
import com.clover.employee.dto.EmployeeDTO;

@RestController
@RequestMapping("/adminaddmem")
public class AdminAddMemberController {
	
	@Autowired
	private AdminMemberService adminmemberService;
	
	@GetMapping
	public ResponseEntity<List<EmployeeDTO>> getAllNew(){
		return ResponseEntity.ok(adminmemberService.getAllNew());
	}
	
	@PutMapping
	public ResponseEntity<Void> addMultiMemState(@RequestBody AdminAddMemDTO adddto){
		adminmemberService.addMemState(adddto);
		return ResponseEntity.ok().build();
	}
	
}
