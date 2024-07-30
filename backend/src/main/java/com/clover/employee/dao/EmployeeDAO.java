package com.clover.employee.dao;

import com.clover.employee.dto.EmployeeDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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
        System.out.println("DAO pw ===== "+ dto.getEmpPw());
        return mybatis.insert("Employee.signUp", dto);
    }

    /** 사원 정보 조회 **/
    public EmployeeDTO getMyInfo(int empSeq) {
        return mybatis.selectOne("Employee.Info", empSeq);
    }

    /** 사원 정보 업데이트 **/
    public void updateEmployee(EmployeeDTO dto) {
        mybatis.update("Employee.update", dto);
    }

    /** 직원 삭제 **/
    public void leaveEmployee(int empSeq) {
        mybatis.delete("Employee.delete", empSeq);
    }
}
