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
	
	//insert && temp
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
	
	//홈에서 출력할 문서
	public List<DocumentDTO> getMainDoc(int empSeq){
		return documentDAO.selectMainDoc(empSeq);
	}
	
	//상신취소
	@Transactional
	public void deleteBySeq(int seq, String table) {
		documentDAO.deleteBySeq(seq);
		documentDAO.deleteByDocTypeSeq(seq, table);
		lineDAO.deleteApvLineBySeq(seq);
		lineDAO.deletePartLineBySeq(seq);
		
	}
	
	//임시저장에서 결재요청시 문서상태 업데이트
	@Transactional
	public void updateDocState(int seq, String table, Map<String,Object> docData) {
		documentDAO.updateDocState(seq);
		documentDAO.updateDocTypeData(table, docData);
	}
	
	//임시저장에서 임시저장시
	public void updateTemptoTemp(String table, Map<String,Object> docData) {
		documentDAO.updateDocTypeData(table, docData);
	}
	
	//임시저장에서 긴급여부 처리
	public void updateTempDocEmergency(int id, String emg) {
		documentDAO.updateTempDocEmergency(id, emg);
	}


}
