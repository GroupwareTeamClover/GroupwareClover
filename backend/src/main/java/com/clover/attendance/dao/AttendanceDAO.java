package com.clover.attendance.dao;

import com.clover.attendance.dto.AttendanceDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class AttendanceDAO {

    @Autowired
    private SqlSession mybatis;

    public AttendanceDTO todayAtt(Map<String, Object> map) {
        AttendanceDTO dto =  mybatis.selectOne("Attendance.today", map);
        System.out.println("att_seq ====== " + dto.getAttSeq());
        System.out.println("emp_seq ====== " + dto.getEmpSeq());
        System.out.println("arrive_seq ====== " + dto.getAttArrive());
        return dto;
    }

    public int arrive(AttendanceDTO dto) {
        return mybatis.insert("Attendance.arrive", dto);
    }

}
