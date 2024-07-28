package com.clover.approval.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.services.DocumentService;

@RestController
@RequestMapping("/document")
public class DocumentController {
	
	@Autowired
	public DocumentService documentService;
	
	

}
