package com.clover.schedule.services;

import com.clover.schedule.dao.ScheduleDAO;
import com.clover.schedule.dto.ScheduleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleDAO scheduleDAO;

    public String addSchedule(ScheduleDTO dto) {
        int result = scheduleDAO.addSchedule(dto);
        if(result > 0) return "ok";
        else return "fail";
    }

    public List<ScheduleDTO> getScheduleList() {
        return scheduleDAO.getScheduleList();
    }

    public String deleteSchedule (int seq) {
        int result = scheduleDAO.deleteSchedule(seq);
        if(result > 0) return "ok";
        else return "fail";
    }
}
