package com.clover.approval.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.DocumentDTO;
import com.clover.approval.dto.ListMappingDTO;
import com.clover.approval.dto.ParticipantsLineDTO;
import com.clover.approval.services.DocumentService;
import com.clover.approval.services.LineService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/approval/list")
public class ListController {
	@Autowired
	public DocumentService documentService;
	
	@Autowired
	public LineService lineService;
	
	@Autowired
	private HttpSession session;
	//사이드바 리스트
	@GetMapping
	public ResponseEntity<ListMappingDTO> getListInfo(){
		List<DocumentDTO> documentDTO = documentService.getAllDoc();
		List<ApvLineDTO> apvlist=lineService.getAllApv();	
		List<ParticipantsLineDTO> plist=lineService.getAllPart();
		ListMappingDTO listInfo=new ListMappingDTO(documentDTO, apvlist, plist);
		return ResponseEntity.ok(listInfo);
	}
	
	//메인리스트
	@GetMapping("/main")
	public ResponseEntity<List<DocumentDTO>> getMainListInfo(){
		 int empSeq = (int) session.getAttribute("cloverSeq");
		List<DocumentDTO> documentDTO = documentService.getMainDoc(empSeq);	
		return ResponseEntity.ok(documentDTO);
	}

}
