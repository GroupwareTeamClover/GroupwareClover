package com.clover.schedule.controllers;

import com.clover.schedule.dto.ScheduleDTO;
import com.clover.schedule.services.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<String> addSchedule(@RequestBody ScheduleDTO dto){
        String result = scheduleService.addSchedule(dto);
        return ResponseEntity.ok(result);
    }

}
