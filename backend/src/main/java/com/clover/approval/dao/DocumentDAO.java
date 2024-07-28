package com.clover.approval.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DocumentDAO {
	@Autowired
	private SqlSession mybatis;
	
	public List<Map<String, ?>> selectDocCodeInfo(){
		List<Map<String, ?>> list= mybatis.selectList("Documents.selectDocCodeInfo");
		for(Map<String,?> map:list) {
			System.out.println(map);
		}
		return list;
	}
}
