package com.clover.approval.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ApvLineDAO {
	
	@Autowired
	private SqlSession mybatis;
	
	
	//임시
	public List<Map<String, ?>> selectMemberInfo(){
		List<Map<String, ?>> list= mybatis.selectList("Documents.selectMemberInfo");
		for(Map<String,?> map:list) {
			System.out.println(map);
		}
		return list;
	}

}
