package com.clover.approval.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.services.DocumentService;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/document")
public class DocumentController {
	
	@Autowired
	public DocumentService documentService;
	
	@Autowired
	private HttpSession session;
	
	@PostMapping
	public ResponseEntity<Void> post(@RequestBody JsonNode documentRequest){
//		String id=(String)session.getAttribute("loginID");
		JsonNode seletedDocCode= documentRequest.get("selectedDocCode");
		JsonNode seletedEmpInfo=documentRequest.get("selectedEmpInfo");
		System.out.println(seletedDocCode);
		System.out.println(seletedEmpInfo);
		
		
		//DocumentDTO로 변환하기
		
		//ApvLineDTO로 변환하기
		
		//
		
		
		
		
		
		
		return ResponseEntity.ok().build();
	}
	
	

}
