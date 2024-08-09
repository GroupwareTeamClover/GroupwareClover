package com.clover.attendance.service;

import com.clover.attendance.dao.AttendanceDAO;
import com.clover.attendance.dto.AttendanceDTO;
import com.clover.commons.DateFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceServoce {

    @Autowired
    private AttendanceDAO attendanceDAO;

    @Autowired
    private DateFormat dateFormat;

    public Map<String, Object> getMyAtt(int empSeq, String month){
        Map<String, Object> map = new HashMap<>();
        String[] range = dateFormat.getMonthRange(month);
        map.put("empSeq", empSeq);
        map.put("start", range[0]);
        map.put("end", range[1]);

        // 총 카운트 정보
        Map<String, Object> attCount = attendanceDAO.getMyAtt(map);

        // 리스트 정보
        List<AttendanceDTO> attList = attendanceDAO.AttendanceList(map);
        for(AttendanceDTO att : attList){
            System.out.println("seq ==== " + att.getAttSeq());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("count", attCount);
        result.put("list", attList);

        return result;
    }

    public AttendanceDTO todayAtt(String today, int empSeq) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("today", today);
        map.put("empSeq", empSeq);
        return attendanceDAO.todayAtt(map);
    }

    public String arrive(AttendanceDTO dto) {
        int result = attendanceDAO.arrive(dto);
        if (result > 0) return "ok";
        else return "fail";
    }

    public String leave(AttendanceDTO dto) {
        int result = attendanceDAO.leave(dto);
        if (result > 0) return "ok";
        else return "fail";
    }

}
