package com.clover.approval.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clover.approval.dao.DocumentDAO;
import com.clover.approval.dao.LineDAO;
import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.BusinessDTO;
import com.clover.approval.dto.DocumentDTO;
import com.clover.approval.dto.InsertMappingDTO;
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
	
	//insert
	@Transactional
	public void insertDoc(DocumentDTO docDTO, List<ApvLineDTO> apvlist, List<ParticipantsLineDTO> plist, DocumentDTO typeDocDTO) {
		documentDAO.insertDoc(docDTO);
		System.out.println(docDTO.getDocSeq());
		
		if(apvlist.size()>0) {
			for(ApvLineDTO dto:apvlist) {
				dto.setDocSeq(docDTO.getDocSeq());
				lineDAO.insertApvLine(dto);
			}
		}
		
		if(plist.size()>0) {
			for(ParticipantsLineDTO dto: plist) {
				dto.setDocSeq(docDTO.getDocSeq());
				lineDAO.insertPartLine(dto);
			}
			
		}
		
		//업무양식
		if(typeDocDTO instanceof BusinessDTO) {
			((BusinessDTO) typeDocDTO).setParentSeq(docDTO.getDocSeq());
			documentDAO.insertBusiness((BusinessDTO)typeDocDTO);
		}
	}
	
	
	public DocumentDTO getDocBySeq(int seq){
		DocumentDTO documentdto = documentDAO.selectDocBySeq(seq);
		return documentdto;
	}
	
	public Map<String,Object> getDocTypeBySeq(int seq, String table) {
		return documentDAO.selectDocTypeBySeq(seq, table);
	}
	
	//리스트에서 전체 문서 출력하기
	public List<DocumentDTO> getAllDoc(){
		return documentDAO.selectAllDoc();
	}

}
