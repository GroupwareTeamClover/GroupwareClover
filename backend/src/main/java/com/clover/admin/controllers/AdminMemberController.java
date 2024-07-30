package com.clover.admin.controllers;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.services.AdminMemberService;

@RestController
@RequestMapping("/adminmember")
public class AdminMemberController {

	@Autowired
	private AdminMemberService adminmemberService;
	
	@GetMapping
	public ResponseEntity<List<HashMap<String, Object>>> get(){
		return ResponseEntity.ok(adminmemberService.getAllData());
	}
	
	
}
