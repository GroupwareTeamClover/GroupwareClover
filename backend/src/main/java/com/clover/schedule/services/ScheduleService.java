package com.clover.schedule.services;

import com.clover.commons.DateFormat;
import com.clover.schedule.dao.ScheduleDAO;
import com.clover.schedule.dto.ScheduleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleDAO scheduleDAO;

    @Autowired
    private DateFormat dataFormat;
    
    /** 스케줄 추가 **/
    public String addSchedule(ScheduleDTO dto) {
        int result = scheduleDAO.addSchedule(dto);
        if(result > 0) return "ok";
        else return "fail";
    }

    /** 전체 스케줄 리스트 **/
    public List<ScheduleDTO> getScheduleList() {
        return scheduleDAO.getScheduleList();
    }
    
    /** My 스케줄 리스트 **/
    public List<ScheduleDTO> getMyScheduleList(int seq) {
        return scheduleDAO.getMyScheduleList(seq);
    }

    /** 스케줄 삭제 **/
    public String deleteSchedule (int seq) {
        int result = scheduleDAO.deleteSchedule(seq);
        if(result > 0) return "ok";
        else return "fail";
    }

    /** 스케줄 수정 **/
    public String updateSchedule(ScheduleDTO dto) {
        int result = scheduleDAO.updateSchedule(dto);
        if(result > 0) return "ok";
        else return "fail";
    }
}
