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
	
	  public List<DocumentDTO> getFinishedDocuments(int page, int size) {
	        int offset = (page - 1) * size;

	        // 파라미터 맵 생성
	        Map<String, Object> params = new HashMap<>();
	        params.put("offset", offset);
	        params.put("limit", size);

	        return mybatis.selectList("DocumentList.findFinishedDocuments", params);
	    }

	    public int getTotalFinishedDocumentsCount() {
	        return mybatis.selectOne("DocumentList.countFinishedDocuments");
	    }

}
