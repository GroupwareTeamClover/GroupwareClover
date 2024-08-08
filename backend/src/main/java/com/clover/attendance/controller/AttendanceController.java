package com.clover.attendance.controller;

import com.clover.attendance.dto.AttendanceDTO;
import com.clover.attendance.service.AttendanceServoce;
import com.clover.commons.DateFormat;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceServoce attendanceServoce;

    @Autowired
    HttpSession session;

    @GetMapping("/{month}")
    public ResponseEntity<Map<String, Object>> getMyAttendance(@PathVariable String month){
        int empSeq = (int) session.getAttribute("cloverSeq");
        Map<String, Object> map = attendanceServoce.getMyAtt(empSeq, month);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/today/{today}")
    public ResponseEntity<AttendanceDTO> selectAttendance(@PathVariable String today){
        int empSeq = (int) session.getAttribute("cloverSeq");
        AttendanceDTO dto = attendanceServoce.todayAtt(today, empSeq);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<String> arrive(@RequestBody AttendanceDTO dto) {
        dto.setEmpSeq((int) session.getAttribute("cloverSeq"));
        return ResponseEntity.ok(attendanceServoce.arrive(dto));
    }

    @PutMapping
    public ResponseEntity<String> leave(@RequestBody AttendanceDTO dto) {
        dto.setEmpSeq((int) session.getAttribute("cloverSeq"));
        return ResponseEntity.ok(attendanceServoce.leave(dto));
    }

}
