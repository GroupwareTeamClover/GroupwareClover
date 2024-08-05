package com.clover.schedule.controllers;

import com.clover.schedule.dto.ScheduleDTO;
import com.clover.schedule.services.ScheduleService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private HttpSession session;

    @PostMapping
    public ResponseEntity<String> addSchedule(@RequestBody ScheduleDTO dto){
        dto.setEmpSeq((int) session.getAttribute("cloverSeq"));
        dto.setDeptCode((int) session.getAttribute("cloverDeptCode"));
        String result = scheduleService.addSchedule(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<ScheduleDTO>> getSchedule(){
        List<ScheduleDTO> list = scheduleService.getScheduleList();
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{seq}")
    public ResponseEntity<String> deleteSchedule(@PathVariable int seq){
        String result = scheduleService.deleteSchedule(seq);
        return ResponseEntity.ok(result);
    }

}
