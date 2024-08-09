package com.clover.admin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.services.AdminLogIpService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/logip")
public class AdminLogIpController {

	@Autowired
	private AdminLogIpService adminlogipService;
	
	 @GetMapping("/login-log")
	    public ResponseEntity<String> logLogin(HttpServletRequest request) {
	        String clientIp = adminlogipService.getMemberIpAddress(request);
	        // IP 주소를 사용하여 로그인 로그를 기록하거나 다른 작업을 수행합니다.
	        return ResponseEntity.ok("사원 IP: " + clientIp);
	    }
}
