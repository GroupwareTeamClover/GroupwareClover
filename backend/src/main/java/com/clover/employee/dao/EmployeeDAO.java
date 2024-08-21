package com.clover.employee.dao;

import com.clover.employee.dto.EmployeeDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class EmployeeDAO {

    @Autowired
    private SqlSession mybatis;

    /** 로그인 **/
    public EmployeeDTO SignIn(EmployeeDTO dto) {
        return mybatis.selectOne("Employee.signIn", dto);
    }

    /** 회원 가입 **/
    public int signUpEmployee(EmployeeDTO dto) {
        return mybatis.insert("Employee.signUp", dto);
    }

    /** 회원 가입 ( 중복체크 ) **/
    public int existsId(String empId) {
        return mybatis.selectOne("Employee.existsId", empId);
    }

    /** 사원 정보 조회 **/
    public Map<String, Object> getMyInfo(int empSeq) {
        return mybatis.selectOne("Employee.getMyInfo", empSeq);
    }

    /** 전 직원 기본 정보 조회 **/
    public List<Map<String, Object>> getMembersInfo(int deptCode) {
        return mybatis.selectList("Employee.getMembersInfo", deptCode);
    }

    /** 사원 정보 업데이트 **/
    public int updateEmployee(EmployeeDTO dto) {
        return mybatis.update("Employee.update", dto);
    }

    /** 사원 비밀번호 변경 **/
    public int updatePwEmployee(EmployeeDTO dto) {
        return mybatis.update("Employee.updatePw", dto);
    }

    /** 사원 프로필 사진 변경 **/
    public int updateAvatarEmployee(EmployeeDTO dto){
        return mybatis.update("Employee.updateAvatar", dto);
    }

    /** 직원 삭제 **/
    public void leaveEmployee(int empSeq) {
        mybatis.delete("Employee.delete", empSeq);
    }

    /** 직원 여부 확인 **/
    public EmployeeDTO existsEmployee(Map<String, String> map) {
        return mybatis.selectOne("Employee.existsEmployee", map);
    }
}
