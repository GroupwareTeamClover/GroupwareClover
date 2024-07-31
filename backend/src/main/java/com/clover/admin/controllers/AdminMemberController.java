package com.clover.admin.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminUpdateMemDTO;
import com.clover.admin.services.AdminMemberService;

@RestController
@RequestMapping("/adminmember")
public class AdminMemberController {

	@Autowired
	private AdminMemberService adminmemberService;
	
	
	@GetMapping
	public ResponseEntity<List<HashMap<String, Object>>> getAllData(){
		return ResponseEntity.ok(adminmemberService.getAllData());
	}
	@GetMapping("/countmem")
	public ResponseEntity<List<HashMap<String,Object>>> getCountMem(){
		return ResponseEntity.ok(adminmemberService.getCountMem());
	}
	
	@PutMapping
	public ResponseEntity<Void> updateMultiMemState(@RequestBody AdminUpdateMemDTO updto){
		System.out.println(updto.getEmpSeqList());
		adminmemberService.updateMemState(updto);
		return ResponseEntity.ok().build();
	}
	
	
	
}
