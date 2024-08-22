package com.clover.approval.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.approval.dto.DocumentDTO;

@Repository
public class ListDAO {

	@Autowired
	private SqlSession mybatis;
	
	//메인카드
	public List<DocumentDTO> getMainCard(int empSeq){
		return mybatis.selectList("DocumentList.selectMainCard", empSeq);
	}
			
	//메인리스트
	public List<DocumentDTO> getMainList(int empSeq){
		return mybatis.selectList("DocumentList.selectMainList", empSeq);
	}
	
	
	//반복되는 코드 공통 메소드
	private int getRecordTotalCount(int empSeq, String searchType, String keyword, String countQueryId) {
		Map<String, Object> map = new HashMap<>();
		map.put("empSeq", empSeq);
        map.put("searchType", searchType);
        map.put("keyword", keyword);
	    return mybatis.selectOne(countQueryId, map);
	}
	
	private List<DocumentDTO> getPageDocuments(int empSeq, int start, int end, String searchType, String keyword, String listQueryId) {
		Map<String, Object> map = new HashMap<>();
	    map.put("empSeq", empSeq);
	    map.put("start", start);
	    map.put("end", end);
	    map.put("searchType", searchType);
	    map.put("keyword", keyword);
	    return mybatis.selectList(listQueryId, map);
	}

	// 기안문서함
	public int getFinishedRecordTotalCount(int empSeq, String searchType, String keyword) {
		return getRecordTotalCount(empSeq, searchType, keyword, "DocumentList.countFinishedDocuments");
	}

	public List<DocumentDTO> getFinishedPageDocuments(int empSeq, int start, int end, String searchType, String keyword) {
		return getPageDocuments(empSeq, start, end, searchType, keyword, "DocumentList.getFinishedPageDocuments");
	}

	// 임시문서함
	public int getTempRecordTotalCount(int empSeq, String searchType, String keyword) {
		return getRecordTotalCount(empSeq, searchType, keyword, "DocumentList.countTempDocuments");
	}

	public List<DocumentDTO> getTempPageDocuments(int empSeq, int start, int end, String searchType, String keyword) {
		return getPageDocuments(empSeq, start, end, searchType, keyword, "DocumentList.getTempPageDocuments");
	}

	// 결재문서함
	public int getApprovalRecordTotalCount(int empSeq, String searchType, String keyword) {
		return getRecordTotalCount(empSeq, searchType, keyword, "DocumentList.countApprovalDocuments");
	}

	public List<DocumentDTO> getApprovalPageDocuments(int empSeq, int start, int end, String searchType, String keyword) {
		return getPageDocuments(empSeq, start, end, searchType, keyword, "DocumentList.getApprovalPageDocuments");
	}

	// 참조/열람문서함
	public int getPartRecordTotalCount(int empSeq, String searchType, String keyword) {
		return getRecordTotalCount(empSeq, searchType, keyword, "DocumentList.countPartDocuments");
	}

	public List<DocumentDTO> getPartPageDocuments(int empSeq, int start, int end, String searchType, String keyword) {
		return getPageDocuments(empSeq, start, end, searchType, keyword, "DocumentList.getPartPageDocuments");
	}

}
