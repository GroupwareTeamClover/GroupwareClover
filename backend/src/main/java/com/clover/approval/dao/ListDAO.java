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
	
	//기안문서함
	public int getFinishedRecordTotalCount(int empSeq, String searchType, String keyword) {
		Map<String, Object> map = new HashMap<>();
		map.put("empSeq", empSeq);
        map.put("searchType", searchType);
        map.put("keyword", keyword);
	   return mybatis.selectOne("DocumentList.countFinishedDocuments",map);
	}
	    
	 public List<DocumentDTO> getFinishedPageDocuments(int empSeq, int start, int end, String searchType, String keyword) {
	        Map<String, Object> map = new HashMap<>();
	        map.put("empSeq", empSeq);
	        map.put("start", start);
	        map.put("end", end);
	        map.put("searchType", searchType);
	        map.put("keyword", keyword);
	        return mybatis.selectList("DocumentList.getFinishedPageDocuments", map);
	 }

	//임시문서함
	public int getTempRecordTotalCount(int empSeq) {
	   return mybatis.selectOne("DocumentList.countTempDocuments",empSeq);
	}
	
	 public List<DocumentDTO> getTempPageDocuments(int empSeq, int start, int end) {
	        Map<String, Integer> map = new HashMap<>();
	        map.put("empSeq", empSeq);
	        map.put("start", start);
	        map.put("end", end);
	        return mybatis.selectList("DocumentList.getTempPageDocuments", map);
	 }
		 
		 
	//결재문서함
	public int getApprovalRecordTotalCount(int empSeq) {
	   return mybatis.selectOne("DocumentList.countApprovalDocuments",empSeq);
	}
			    
	 public List<DocumentDTO> getApprovalPageDocuments(int empSeq, int start, int end) {
	       Map<String, Integer> map = new HashMap<>();
	       map.put("empSeq", empSeq);
		   map.put("start", start);
	       map.put("end", end);
	       return mybatis.selectList("DocumentList.getApprovalPageDocuments", map);
	 }
			
			 
	//참조/열람문서함
	public int getPartRecordTotalCount(int empSeq) {
			  return mybatis.selectOne("DocumentList.countPartDocuments",empSeq);
	}
				    
	public List<DocumentDTO> getPartPageDocuments(int empSeq, int start, int end) {
	    Map<String, Integer> map = new HashMap<>();
	    map.put("empSeq", empSeq);
	    map.put("start", start);
       map.put("end", end);
      return mybatis.selectList("DocumentList.getPartPageDocuments", map);
	 }

}
