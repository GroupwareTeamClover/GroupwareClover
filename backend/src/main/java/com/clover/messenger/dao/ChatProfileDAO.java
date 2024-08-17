package com.clover.messenger.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.employee.dto.EmployeeDTO;

@Repository
public class ChatProfileDAO {

    @Autowired
    private SqlSession mybatis;

    /**
     * 특정 사용자의 프로필 정보를 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 사용자의 프로필 정보
     */
    public HashMap<String, Object> getProfile(int empSeq) {
        return mybatis.selectOne("ChatProfileMapper.getProfile", empSeq);
    }

    /**
     * 사원의 이름을 조회하는 메서드
     * @param empSeq 사원 번호
     * @return 사원의 이름
     */
    public EmployeeDTO getEmployeeName(int empSeq) {
        return mybatis.selectOne("ChatProfileMapper.getEmployeeName", empSeq);
    }

    /**
     * 조직도를 조회하는 메서드
     * @return 조직도 정보
     */    
    public List<HashMap<String, Object>> getOrganization(){
		return mybatis.selectList("ChatProfileMapper.getOrganization");
	}    
}
