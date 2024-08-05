package com.clover.admin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminPopupDTO;
import com.clover.admin.services.AdminPopupService;

@RestController
@RequestMapping("/adminpopup")
public class AdminPopupController {

	@Autowired
	private AdminPopupService adminpopupService;
	
	@PostMapping("/create")
	public ResponseEntity<Void> createPopup(@RequestBody AdminPopupDTO popupdto){
		adminpopupService.createPopup(popupdto);
		return ResponseEntity.ok().build();
		
	}
}


