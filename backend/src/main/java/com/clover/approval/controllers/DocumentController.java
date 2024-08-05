package com.clover.approval.controllers;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.dto.BusinessDTO;
import com.clover.approval.dto.DocumentDTO;
import com.clover.approval.dto.InsertMappingDTO;
import com.clover.approval.factory.DocumentFactory;
import com.clover.approval.services.DocumentService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/approval")
public class DocumentController {
	
	@Autowired
	public DocumentService documentService;
	
	@Autowired
	private HttpSession session;
	
	
	@PostMapping("/document")
	 public ResponseEntity<Integer> insertData(@RequestBody InsertMappingDTO insertMappingDTO) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			// DocumentDTO 객체 추출
			System.out.println("------------------");
	        System.out.println(insertMappingDTO.getDocument().getCurrentApverSeq());
	        System.out.println(insertMappingDTO.getDocument().getFinalApverSeq());

	        // DTO 처리
	        // 팩토리 패턴을 사용하여 적절한 DocumentDTO 생성
	        DocumentDTO document=insertMappingDTO.getDocument();
	        DocumentDTO typeDocument = DocumentFactory.createDocument(insertMappingDTO.getDocType());
	        
	        if (typeDocument instanceof BusinessDTO) {
	            BusinessDTO TypeDocDTO = (BusinessDTO) typeDocument;
	            TypeDocDTO.setBsSeq((int) insertMappingDTO.getDocData().get("bsSeq"));
	            TypeDocDTO.setBsTitle((String) insertMappingDTO.getDocData().get("bsTitle"));
	            TypeDocDTO.setBsContent((String) insertMappingDTO.getDocData().get("bsContent"));
	            Date parsedDate=null;
				try {
					parsedDate = dateFormat.parse((String) insertMappingDTO.getDocData().get("bsWriteDate"));
				} catch (ParseException e) {
					e.printStackTrace();
				}
				TypeDocDTO.setBsWriteDate(new Timestamp(parsedDate.getTime()));
				TypeDocDTO.setParentSeq((int) insertMappingDTO.getDocData().get("parentSeq"));
//	            System.out.println(business.getBsContent());
		        documentService.insertDoc(document, insertMappingDTO.getApvline(), insertMappingDTO.getPline(), TypeDocDTO);
	        }
	        	       
	        return ResponseEntity.ok(document.getDocSeq());
	    }
	
	
	

}
