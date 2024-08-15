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

	public int getRecordTotalCount(int empSeq) {
	   return mybatis.selectOne("DocumentList.countFinishedDocuments",empSeq);
	}
	    
	 public List<DocumentDTO> getFinishedPageDocuments(int empSeq, int start, int end) {
	        Map<String, Integer> map = new HashMap<>();
	        map.put("empSeq", empSeq);
	        map.put("start", start);
	        map.put("end", end);
	        return mybatis.selectList("DocumentList.getFinishedPageDocuments", map);
	 }

}
