package com.clover.messenger.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.messenger.dto.NotificationDTO;
import com.clover.messenger.services.ChatNotificationService;
import com.clover.messenger.services.ChatRoomService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/chat/notifications")
public class NotificationController {
    
    @Autowired
    private ChatNotificationService notificationService;

    @Autowired
    private ChatRoomService chatRoomService;  

    /**
     * 사용자의 알림 목록을 조회하는 API 엔드포인트
     * @param session HTTP 세션
     * @return 사용자의 알림 목록
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(HttpSession session) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        if (empSeq == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<NotificationDTO> notifications = notificationService.getNotifications(empSeq);
        return ResponseEntity.ok(notifications);
    }

    /**
     * 특정 알림을 읽음 처리하는 API 엔드포인트
     * @param notificationSeq 읽음 처리할 알림의 번호
     * @param session HTTP 세션
     * @return 처리 결과
     */
    @PostMapping("/read/{notificationSeq}")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable int notificationSeq, HttpSession session) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        if (empSeq == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        notificationService.markNotificationAsRead(notificationSeq);
        return ResponseEntity.ok().build();
    }

    /**
     * 채팅방 알림 설정을 토글하는 API 엔드포인트
     * @param roomSeq 알림 설정을 변경할 채팅방 번호
     * @param enabled 알림 활성화 여부
     * @param session HTTP 세션
     * @return 처리 결과
     */
    @PostMapping("/{roomSeq}")
    public ResponseEntity<?> toggleNotifications(@PathVariable int roomSeq, @RequestBody boolean enabled, HttpSession session) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        if (empSeq == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        chatRoomService.toggleNotifications(roomSeq, empSeq, enabled); 
        return ResponseEntity.ok().build();
    }
}
