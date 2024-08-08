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

    public Map<String, Object> getMyAtt(Map<String, Object> map) {
        return mybatis.selectOne("Attendance.getMyAtt", map);
    }

    public AttendanceDTO todayAtt(Map<String, Object> map) {
        return mybatis.selectOne("Attendance.today", map);
    }

    public int arrive(AttendanceDTO dto) {
        return mybatis.insert("Attendance.arrive", dto);
    }

    public int leave(AttendanceDTO dto) {
        return mybatis.update("Attendance.leave", dto);
    }

}
