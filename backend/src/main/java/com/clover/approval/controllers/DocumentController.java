package com.clover.approval.controllers;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
import com.clover.commons.dto.AttachmentDTO;
import com.clover.commons.services.AttachmentService;
import com.clover.commons.services.S3Service;
import com.clover.employee.services.EmployeeService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/approval/document")
public class DocumentController {
	
	@Autowired
	public DocumentService documentService;
	
	@Autowired
	public LineService lineService;
	
	@Autowired
	public EmployeeService employeeService;
	
	@Autowired
	private HttpSession session;
	
	@Autowired
    private S3Service s3Serv;
	
	@Autowired
	private AttachmentService attServ;
	
	//insert-문서,결재자,참조/열람자,양식정보까지 && 임시저장
	@PostMapping
	public ResponseEntity<Integer> insertData(@RequestBody InsertMappingDTO insertMappingDTO) {
	    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

	    // DTO 처리
	    // 팩토리 패턴을 사용하여 적절한 DocumentDTO 생성
	    DocumentDTO document = insertMappingDTO.getDocument();
	    DocumentDTO typeDocument = DocumentFactory.createDocument(insertMappingDTO.getDocType());
        String content=(String) insertMappingDTO.getDocData().get("bsContent");
	    if (typeDocument instanceof BusinessDTO) {
	        BusinessDTO TypeDocDTO = (BusinessDTO) typeDocument;
	        TypeDocDTO.setBsSeq((int) insertMappingDTO.getDocData().get("bsSeq"));
	        TypeDocDTO.setBsTitle((String) insertMappingDTO.getDocData().get("bsTitle"));
	        TypeDocDTO.setBsContent((String) insertMappingDTO.getDocData().get("bsContent"));
	        
	        // 날짜 처리
	        Object bsWriteDate = insertMappingDTO.getDocData().get("bsWriteDate");
	        if (bsWriteDate instanceof Date) {
	            // bsWriteDate가 Date 객체일 경우
	            TypeDocDTO.setBsWriteDate((Date) bsWriteDate);
	        } else if (bsWriteDate instanceof String) {
	            // bsWriteDate가 String 객체일 경우
	            String dateStr = (String) bsWriteDate;
	            if (!dateStr.trim().isEmpty()) {
	                try {
	                    Date parsedDate = dateFormat.parse(dateStr);
	                    TypeDocDTO.setBsWriteDate(parsedDate);
	                } catch (ParseException e) {
	                    e.printStackTrace();
	                    // 파싱 오류 발생 시 null로 설정 (필요에 따라 예외 처리 가능)
	                    TypeDocDTO.setBsWriteDate(null);
	                }
	            } else {
	                // 빈 문자열인 경우 null로 설정
	                TypeDocDTO.setBsWriteDate(null);
	            }
	        } else {
	            // bsWriteDate가 null이거나 다른 타입일 경우
	            TypeDocDTO.setBsWriteDate(null);
	        }

	        TypeDocDTO.setParentSeq((int) insertMappingDTO.getDocData().get("parentSeq"));
	        documentService.insertDoc(document, insertMappingDTO.getApvline(), insertMappingDTO.getPline(), TypeDocDTO);
	    }
	    
		//첨부파일명, 첨부파일URL, 이미지URL 데이터 받아오기
		List<String> fileNames = (List<String>) insertMappingDTO.getFileData().getOrDefault("fileNames", new ArrayList<>());
	    List<String> fileUrls = (List<String>) insertMappingDTO.getFileData().getOrDefault("fileUrls", new ArrayList<>());
	    List<String> images = (List<String>) insertMappingDTO.getFileData().getOrDefault("images", new ArrayList<>());
		System.out.println(insertMappingDTO.getFileData());
	    System.out.println(fileNames);
		System.out.println(fileUrls);
		System.out.println(images);
	    //첨부파일이 있을 경우
	    if (fileNames.size() > 0) {
			for (int i = 0; i < fileNames.size(); i ++) {
				//파일 주소 변환 후 DB에 등록
				String newFilePath = "posts/" + document.getDocSeq() + "/" + UUID.randomUUID() + "_" + fileNames.get(i);
				String newFileUrl = s3Serv.moveFile(newFilePath, fileUrls.get(i));
				
				attServ.insertFile(new AttachmentDTO(0, fileNames.get(i), newFileUrl, "approval", document.getDocSeq()));
			}
		}
		//첨부 이미지가 있을 경우
		if (images.size() > 0) {
			for (int i = 0; i < images.size(); i ++) {
				String newImagePath = "images/posts/" + document.getDocSeq() + "/" + UUID.randomUUID() + "_image" + (i+1); 
				//이미지 주소 변환 후 글내용에서 예전 image주소들을 찾아 새로운 주소로 변환
				String newImageUrl = s3Serv.moveFile(newImagePath, images.get(i));
				//변환된 주소로 글 내용을 바꾸고 반환
				content = attServ.updateImageUrl(images.get(i), newImageUrl, content);
			}
			// 최종적으로 업데이트된 글내용을 DB에 업데이트
			attServ.updateContent(content, document.getDocSeq(), "Document");
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
	public ResponseEntity<Map<String,Object>> getDocTypeBySeq(@PathVariable int id, @PathVariable String type, @RequestParam String table){
		Map<String, Object> map =documentService.getDocTypeBySeq(id, table);
		System.out.println(map);
		return ResponseEntity.ok(map);
	}
	
	//상신취소 & 임시저장에서 삭제
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable int id, @RequestParam String table){
		System.out.println(table);
		documentService.deleteBySeq(id, table);
		
		//파일삭제
		attServ.deleteFiles(id, "approval");
		s3Serv.deleteFiles("posts/" + id + "/");
		s3Serv.deleteFiles("images/posts/"  + id + "/");
		return ResponseEntity.ok().build();
	}
	
	//임시저장에서 결재요청, 문서상태 임시저장->진행중으로 변경
	@PutMapping("/temp/{id}/{type}")
	public ResponseEntity<Map<String,Object>> updateDocState(@PathVariable int id,@PathVariable String type, @RequestParam String table, @RequestBody InsertMappingDTO insertMappingDTO){
		documentService.updateDocState(id, table, insertMappingDTO.getDocData());
		Map<String, Object> map=new HashMap<>();
		map.put("id", id);
		map.put("type",type);
		return ResponseEntity.ok(map);
	}
	
	//임시저장에서 임시저장, 양식마다 정보 변경
	@PutMapping("/temp/temp/{id}/{type}")
	public ResponseEntity<Map<String,Object>> updateTemptoTemp(@PathVariable int id, @PathVariable String type, @RequestParam String table, @RequestBody InsertMappingDTO insertMappingDTO){
		System.out.println(insertMappingDTO.getDocData());
		documentService.updateTemptoTemp(table, insertMappingDTO.getDocData());
		Map<String, Object> map=new HashMap<>();
		map.put("id", id);
		map.put("type",type);
		return ResponseEntity.ok(map);
	}
	
	//임시저장에서 긴급여부 수정
	@PutMapping("/temp/emergency/{id}")
	public ResponseEntity<Void> updateTempDocEmergency(@PathVariable int id, @RequestBody Map<String,String> request){
		 String isTempEmergency = request.get("isTempEmergency");
		documentService.updateTempDocEmergency(id, isTempEmergency);
		return ResponseEntity.ok().build();
	}
	
	
	
	
	

}
