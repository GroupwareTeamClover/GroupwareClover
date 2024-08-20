package com.clover.attendance.service;

import com.clover.attendance.dao.AttendanceDAO;
import com.clover.attendance.dto.AttendanceDTO;
import com.clover.commons.DateFormat;
import com.clover.employee.dao.EmployeeDAO;
import com.clover.employee.dto.EmployeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceDAO attendanceDAO;

    @Autowired
    private EmployeeDAO employeeDAO;

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
        Map<String, Object> result = new HashMap<>();
        result.put("count", attCount);
        result.put("list", attList);
        return result;
    }

    public List<Map<String, Object>> getMembersAtt(int deptCode, String month) {
        Map<String, Object> map = new HashMap<>();
        String[] range = dateFormat.getMonthRange(month);
        map.put("start", range[0]);
        map.put("end", range[1]);

        List<Map<String, Object>> resultList = new ArrayList<>();
        // 전체 멤버 조회
        List<Map<String, Object>> list = employeeDAO.getMembersInfo(deptCode);
        for (Map<String, Object> dto : list) {
            // 멤버 별 카운트 조회
            map.put("empSeq", dto.get("empSeq"));
            Map<String, Object> attCount = attendanceDAO.getMyAtt(map);

            Map<String, Object> result = new HashMap<>();
            result.put("empSeq", dto.get("empSeq"));
            result.put("empName", dto.get("empName"));
            result.put("roleCode", dto.get("roleCode"));
            result.put("roleName", dto.get("roleName"));
            result.put("deptName", dto.get("deptName"));
            result.put("attCount", attCount);

            resultList.add(result);
        }

        return resultList;
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
