package com.clover.approval.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ListDAO {
	
	@Autowired
	private SqlSession mybatis;
	
	//기안진행 전체 레코드 수
	public int getAllProgressCount(int empSeq) {
		return mybatis.selectOne("DocumentList.selectAllProgressCount", empSeq);
	}

}
