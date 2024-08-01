package com.clover.approval.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clover.approval.dao.DocumentDAO;
import com.clover.approval.dao.LineDAO;
import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.DocumentDTO;
import com.clover.approval.dto.ParticipantsLineDTO;

@Service
public class DocumentService {
	
	@Autowired
	private DocumentDAO documentDAO;
	
	@Autowired
	private LineDAO lineDAO;
	
	
	

	//폴더에 보여줄 양식 전체 정보
	public List<Map<String,?>> getDocCodeInfo(){
		return documentDAO.selectDocCodeInfo();
	}
	
	@Transactional
	public void modalInsertDoc(DocumentDTO docdto, List<ApvLineDTO> apvlist, List<ParticipantsLineDTO> plist) {
		documentDAO.modalInsetDoc(docdto);
		System.out.println(docdto.getDocSeq());
		
		if(apvlist.size()>0) {
			for(ApvLineDTO dto:apvlist) {
				dto.setDocSeq(docdto.getDocSeq());
				lineDAO.modalInsertApvLine(dto);
			}
		}
		
		if(plist.size()>0) {
			for(ParticipantsLineDTO dto: plist) {
				dto.setDocSeq(docdto.getDocSeq());
				lineDAO.modalInsertPartLine(dto);
			}
			
		}
		
		
		
		
		
	}


}
