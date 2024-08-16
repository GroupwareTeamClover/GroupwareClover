package com.clover.approval.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.DocumentDTO;
import com.clover.approval.dto.ListMappingDTO;
import com.clover.approval.dto.PageDocumentList;
import com.clover.approval.dto.ParticipantsLineDTO;
import com.clover.approval.services.DocumentService;
import com.clover.approval.services.LineService;
import com.clover.approval.services.ListService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/approval/list")
public class ListController {
	@Autowired
	public DocumentService documentService;
	
	@Autowired
	public LineService lineService;
	
	@Autowired
	public ListService listService;
	
	@Autowired
	private HttpSession session;
	
	private String type;
	
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
	
	//기안문서함
    @GetMapping("/finish")
    public ResponseEntity<PageDocumentList> getFinishedDocuments(
    		@RequestParam(value = "cpage", defaultValue = "1") int cpage, 
        @RequestParam(value = "recordCountPerPage") int recordCountPerPage, //고정값: 한페이지 몇개글
        @RequestParam(value = "naviCountPerPage") int naviCountPerPage) { //고정값: 페이지번호 자체
    	
    	int empSeq = (int) session.getAttribute("cloverSeq");
    	
    	System.out.println("현재페이지" + cpage);
    	System.out.println("한페이지에 보여줄 글 수" + recordCountPerPage);
    	System.out.println("네비 범위" + naviCountPerPage);
    	
    	type="기안문서함";
        // 전체게시글 수
        int recordTotalCount = listService.getRecordTotalCount(type, empSeq);
        System.out.println(recordTotalCount);
        
        // 페이지에 맞는 list 가지고 오기, 전체 문서 수 가져오기 (총 페이지 계산에 사용)
		//컬럼 시작점, 컬럼 끝점 
       List<DocumentDTO> list = listService.getPageDocuments(type, empSeq, cpage*recordCountPerPage-(recordCountPerPage-1),cpage*recordCountPerPage);
       for(DocumentDTO dto:list) {
    	   System.out.println(dto.getDocSeq());
       }
       
       PageDocumentList resp =new PageDocumentList(list, recordTotalCount);
        return ResponseEntity.ok(resp);
    }
    
	//임시문서함
    @GetMapping("/temp")
    public ResponseEntity<PageDocumentList> getTempDocuments(
    		@RequestParam(value = "cpage", defaultValue = "1") int cpage, 
        @RequestParam(value = "recordCountPerPage") int recordCountPerPage, //고정값: 한페이지 몇개글
        @RequestParam(value = "naviCountPerPage") int naviCountPerPage) { //고정값: 페이지번호 자체
    	
    	int empSeq = (int) session.getAttribute("cloverSeq");
    	
    	System.out.println("현재페이지" + cpage);
    	System.out.println("한페이지에 보여줄 글 수" + recordCountPerPage);
    	System.out.println("네비 범위" + naviCountPerPage);
    	
    	type="임시문서함";
        // 전체게시글 수
        int recordTotalCount = listService.getRecordTotalCount(type, empSeq);
        System.out.println(recordTotalCount);
        
        // 페이지에 맞는 list 가지고 오기, 전체 문서 수 가져오기 (총 페이지 계산에 사용)
		//컬럼 시작점, 컬럼 끝점 
       List<DocumentDTO> list = listService.getPageDocuments(type, empSeq, cpage*recordCountPerPage-(recordCountPerPage-1),cpage*recordCountPerPage);
       for(DocumentDTO dto:list) {
    	   System.out.println(dto.getDocSeq());
       }
       
       PageDocumentList resp =new PageDocumentList(list, recordTotalCount);
        return ResponseEntity.ok(resp);
    }
    
  //결재문서함
    @GetMapping("/approval")
    public ResponseEntity<PageDocumentList> getApprovalDocuments(
    		@RequestParam(value = "cpage", defaultValue = "1") int cpage, 
        @RequestParam(value = "recordCountPerPage") int recordCountPerPage, //고정값: 한페이지 몇개글
        @RequestParam(value = "naviCountPerPage") int naviCountPerPage) { //고정값: 페이지번호 자체
    	
    	int empSeq = (int) session.getAttribute("cloverSeq");
    	
    	System.out.println("현재페이지" + cpage);
    	System.out.println("한페이지에 보여줄 글 수" + recordCountPerPage);
    	System.out.println("네비 범위" + naviCountPerPage);
    	
    	type="결재문서함";
        // 전체게시글 수
        int recordTotalCount = listService.getRecordTotalCount(type, empSeq);
        System.out.println(recordTotalCount);
        
        // 페이지에 맞는 list 가지고 오기, 전체 문서 수 가져오기 (총 페이지 계산에 사용)
		//컬럼 시작점, 컬럼 끝점 
       List<DocumentDTO> list = listService.getPageDocuments(type, empSeq, cpage*recordCountPerPage-(recordCountPerPage-1),cpage*recordCountPerPage);
       for(DocumentDTO dto:list) {
    	   System.out.println(dto.getDocSeq());
       }
       
       PageDocumentList resp =new PageDocumentList(list, recordTotalCount);
        return ResponseEntity.ok(resp);
    }
    
  //참조/열람문서함
    @GetMapping("/part")
    public ResponseEntity<PageDocumentList> getPartDocuments(
    		@RequestParam(value = "cpage", defaultValue = "1") int cpage, 
        @RequestParam(value = "recordCountPerPage") int recordCountPerPage, //고정값: 한페이지 몇개글
        @RequestParam(value = "naviCountPerPage") int naviCountPerPage) { //고정값: 페이지번호 자체
    	
    	int empSeq = (int) session.getAttribute("cloverSeq");
    	
    	System.out.println("현재페이지" + cpage);
    	System.out.println("한페이지에 보여줄 글 수" + recordCountPerPage);
    	System.out.println("네비 범위" + naviCountPerPage);
    	
    	type="참조/열람문서함";
        // 전체게시글 수
        int recordTotalCount = listService.getRecordTotalCount(type, empSeq);
        System.out.println(recordTotalCount);
        
        // 페이지에 맞는 list 가지고 오기, 전체 문서 수 가져오기 (총 페이지 계산에 사용)
		//컬럼 시작점, 컬럼 끝점 
       List<DocumentDTO> list = listService.getPageDocuments(type, empSeq, cpage*recordCountPerPage-(recordCountPerPage-1),cpage*recordCountPerPage);
       for(DocumentDTO dto:list) {
    	   System.out.println(dto.getDocSeq());
       }
       
       PageDocumentList resp =new PageDocumentList(list, recordTotalCount);
        return ResponseEntity.ok(resp);
    }
	
	

}
