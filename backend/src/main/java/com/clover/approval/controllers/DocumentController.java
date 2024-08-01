package com.clover.approval.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.DocumentDTO;
import com.clover.approval.dto.ParticipantsLineDTO;
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
	public ResponseEntity<Map<String, Object>> post(@RequestBody JsonNode documentRequest){
		Integer empSeq=(Integer)session.getAttribute("cloverSeq");
		JsonNode selectedDocCode= documentRequest.get("selectedDocCode");
		JsonNode selectedEmpInfo=documentRequest.get("selectedEmpInfo");
		
		//DocumentDTO로 변환하기
		int docDetailCode=selectedDocCode.get("children").get("detailcode").asInt();
		String docDetailName=selectedDocCode.get("children").get("name").asText();
			//3번째 1은 문성상태 대기 
		DocumentDTO docdto=new DocumentDTO(0,docDetailCode, 1, empSeq, "n", null, null, 0, 0, null);
		
		//ApvLineDTO로 변환하기
		JsonNode apvChoiceNode = selectedEmpInfo.get("apvchoice");
		List<ApvLineDTO> apvlist=new ArrayList<>();
		 if (apvChoiceNode.size()>0) {
			int order=1;
		    for (JsonNode node : apvChoiceNode) {
		      Integer seq = node.get("seq").asInt();
		      //String name = node.get("name").asText();
		      //String role = node.get("role").asText();
		      //String department = node.get("department").asText();
		      //2번쨰 1은 결재상태 대기, 마지막 0은 생성된 문서코드를 받아서 넣어줘야 한다.
		      ApvLineDTO linedto=new ApvLineDTO(0, 1, seq, null, order, null, 0);
		      apvlist.add(linedto);
		      order+=1;
		     }
		 }
		
		
		//ParticipantsLineDTO로 변환하기
		 JsonNode refChoiceNode = selectedEmpInfo.get("refchoice");
		 JsonNode vieChoiceNode = selectedEmpInfo.get("viechoice");
		 List<ParticipantsLineDTO> plist=new ArrayList<>();
		 if(refChoiceNode.size()>0) {
			    for (JsonNode node : refChoiceNode) {
			    	Integer seq = node.get("seq").asInt();
			        //f=참조자, 마지막 0은 생성된 문서코드를 받아서 넣어줘야 한다.
			    	ParticipantsLineDTO plinedto= new ParticipantsLineDTO(0,seq,"f","n",null,0);
			    	plist.add(plinedto);
			    }
		 }
		 
		 if(vieChoiceNode.size()>0) {
			 for (JsonNode node : vieChoiceNode) {
				 Integer seq = node.get("seq").asInt();
				 //c=열람자, 마지막 0은 생성된 문서코드를 받아서 넣어줘야 한다.
				 ParticipantsLineDTO plinedto= new ParticipantsLineDTO(0,seq,"c","n",null,0);
				 plist.add(plinedto);
			 }	 
		 }
		 
		 documentService.modalInsertDoc(docdto, apvlist, plist);
		 
		 Map<String, Object> response=new HashMap<>();
		 response.put("docdto", docdto);
		 response.put("apvlist", apvlist);
		 response.put("plist", plist);
		 response.put("docDetailName", docDetailName);
		 
		 return ResponseEntity.ok(response);
		
		//콘솔 값 확인
		//System.out.println("로그인사번"+empSeq);
		//System.out.println(selectedDocCode);
		//System.out.println(selectedEmpInfo);
		//System.out.println(apvChoiceNode);
		//for(ApvLineDTO dto:list) {
		//System.out.println(dto.getApverId());
		//}
		
	}
	
	

}
