package com.clover.approval.controllers;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.BusinessDTO;
import com.clover.approval.dto.DocumentDTO;
import com.clover.approval.dto.InsertMappingDTO;
import com.clover.approval.dto.ParticipantsLineDTO;
import com.clover.approval.factory.DocumentFactory;
import com.clover.approval.services.DocumentService;
import com.clover.approval.services.LineService;
import com.clover.employee.services.EmployeeService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/approval/document")
public class DocumentController {
	
	@Autowired
	public DocumentService documentService;
	
	@Autowired
	public LineService lineService;
	
	@Autowired
	public EmployeeService employeeService;
	
	@Autowired
	private HttpSession session;
	
	//insert-문서,결재자,참조/열람자,양식정보까지
	@PostMapping
	 public ResponseEntity<Integer> insertData(@RequestBody InsertMappingDTO insertMappingDTO) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

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
				TypeDocDTO.setBsWriteDate(parsedDate);
				TypeDocDTO.setParentSeq((int) insertMappingDTO.getDocData().get("parentSeq"));
//	            System.out.println(business.getBsContent());
		        documentService.insertDoc(document, insertMappingDTO.getApvline(), insertMappingDTO.getPline(), TypeDocDTO);
	        }
	        	       
	        return ResponseEntity.ok(document.getDocSeq());
	    }
	
	//select-문서,기안자,참조/열람자 정보
	@GetMapping("/{id}")
	public ResponseEntity<InsertMappingDTO> getDocBySeq(@PathVariable Integer id){
		DocumentDTO documentDTO=null;
		List<ApvLineDTO> apvlist=null;
		List<ParticipantsLineDTO> plist=null;
		InsertMappingDTO selectInfos=null;
		
		
		if(id != null) {
			documentDTO = documentService.getDocBySeq(id);
			apvlist=lineService.getLineBySeq(id);	
			plist=lineService.getPartBySeq(id);
			selectInfos=new InsertMappingDTO(documentDTO, apvlist, plist);
		}
		
		return ResponseEntity.ok(selectInfos);
	}
	
	//select-양식 정보
	@GetMapping("/{id}/{type}")
	public ResponseEntity<Map<String,Object>> getDocTypeBySeq(@PathVariable Integer id, @PathVariable String type, @RequestParam String table){
		System.out.println(type);
		System.out.println(table);
		Map<String, Object> map =documentService.getDocTypeBySeq(id, table);
		return ResponseEntity.ok(map);
	}
	
	
	
	

}
