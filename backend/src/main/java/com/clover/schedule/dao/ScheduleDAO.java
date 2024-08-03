package com.clover.schedule.dao;

import com.clover.schedule.dto.ScheduleDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ScheduleDAO {

    @Autowired
    private SqlSession mybatis;

    public int addSchedule(ScheduleDTO dto){
        return mybatis.insert("Schedule.addSchedule", dto);
    }

}
