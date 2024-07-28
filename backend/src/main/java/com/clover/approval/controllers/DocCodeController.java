package com.clover.approval.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.services.DocumentService;

@RestController
@RequestMapping("/docCode")
public class DocCodeController {
	
	@Autowired
	private DocumentService documentService;
	
	@GetMapping
	public ResponseEntity<List<Map<String,?>>> get(){
		List<Map<String,?>> list=documentService.getDocCodeInfo();
		return ResponseEntity.ok(list);
	}
}
