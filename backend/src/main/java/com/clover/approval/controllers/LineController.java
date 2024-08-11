package com.clover.approval.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.services.LineService;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/approval/line")
public class LineController {
	 @Autowired
	private LineService lineService;
	 
	 @Autowired
	private HttpSession session;
	
    /* 전자결재 결재자 라인 선택시 임직원 정보 가져오기 */
    @GetMapping
	public ResponseEntity<List<Map<String,?>>> get(){
    	int empSeq = (int) session.getAttribute("cloverSeq");
    	//결재자 선택에서 자신은 제외
		return ResponseEntity.ok(lineService.getMemberInfo(empSeq));
	}
    
    //대기상태에서 -> 결재로 결재상태업데이트, apvline변화에 따라 문서상태로 변화  
    @PutMapping("/{cleanApvLineSeq}/{id}/approval")
	public ResponseEntity<Void> put( @PathVariable("cleanApvLineSeq") int cleanApvLineSeq, @PathVariable("id") int id){
    	lineService.updateWaitToApproval(cleanApvLineSeq, id);
    	return ResponseEntity.ok().build();
	}
    
    //대기상태에서 -> 반려로 상태업데이트, apvline변화에 따라 문서상태도 변화시키기
    @PutMapping("/{lineSeq}/{id}/reject")
    public ResponseEntity<String> rejectApproval(
            @PathVariable int lineSeq,
            @PathVariable int id,
            @RequestBody JsonNode requestBody) {
        // JSON 객체에서 특정 필드 추출
        String reasonForRejection = requestBody.get("reasonForRejection").asText();
        System.out.println("Reason for Rejection: " + reasonForRejection);
        
        lineService.updateWaitToReject(id, lineSeq, reasonForRejection);

  
        return ResponseEntity.ok().build();
    }

}
