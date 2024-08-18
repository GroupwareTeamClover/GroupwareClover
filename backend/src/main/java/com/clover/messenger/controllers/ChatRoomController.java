package com.clover.messenger.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.services.ChatRoomService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/chat/rooms")
public class ChatRoomController {
    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private HttpSession session;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 채팅방 목록을 조회하는 API 엔드포인트
     * @return 로그인한 사용자의 채팅방 목록
     */
    @GetMapping
    public ResponseEntity<List<ChatRoomDTO>> getChatRooms() {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        List<ChatRoomDTO> rooms = chatRoomService.getChatRoomsWithDetails(empSeq);
        return ResponseEntity.ok(rooms);
    }

    /**
     * 1:1 채팅방을 생성하는 API 엔드포인트
     * @param payload 대화 상대방의 사원 번호를 포함한 요청 본문
     * @return 생성된 채팅방 정보
     */
    @PostMapping
    public ResponseEntity<ChatRoomDTO> createOneToOneRoom(@RequestBody Map<String, Integer> payload) {
        int empSeq = (int) session.getAttribute("cloverSeq");
        int targetEmpSeq = payload.get("targetEmpSeq");
        
        ChatRoomDTO room = chatRoomService.createOneToOneRoom(empSeq, targetEmpSeq);
        
        // 생성자에게 채팅방 정보 전송
        messagingTemplate.convertAndSendToUser(String.valueOf(empSeq), "/queue/newChatRoom", room);
        
        // 타겟 사용자를 위한 채팅방 정보 가져오기
        ChatRoomDTO roomForTarget = chatRoomService.getRoomInfoForUser(room.getRoomSeq(), targetEmpSeq);
        
        // 타겟 사용자에게 채팅방 정보 전송
        messagingTemplate.convertAndSendToUser(String.valueOf(targetEmpSeq), "/queue/targetNewChatRoom", roomForTarget);
        
        return ResponseEntity.ok(room);
    }
    
    /**
     * 그룹 채팅방을 생성하는 API 엔드포인트
     * @param payload 채팅방 이름과 참가자 목록을 포함한 요청 본문
     * @param session HTTP 세션
     * @return 생성된 그룹 채팅방 정보
     */
    @PostMapping("/group")
    public ResponseEntity<ChatRoomDTO> createGroupRoom(@RequestBody Map<String, Object> payload, HttpSession session) {
        String roomName = (String) payload.get("roomName");
        List<Map<String, Object>> participants = (List<Map<String, Object>>) payload.get("participants");
        Integer creatorSeq = (Integer) session.getAttribute("cloverSeq");
        
        if (creatorSeq == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<Integer> participantSeqs = participants.stream()
            .map(p -> ((Number) p.get("seq")).intValue())
            .collect(Collectors.toList());

        ChatRoomDTO room = chatRoomService.createGroupRoom(roomName, creatorSeq, participantSeqs, participants);
        
        // WebSocket을 통해 참가자들에게 새 그룹 채팅방 생성 알림
        for (int participantSeq : participantSeqs) {
            messagingTemplate.convertAndSendToUser(
                String.valueOf(participantSeq),
                "/queue/newGroupChatRoom",
                room
            );
        }
        
        return ResponseEntity.ok(room);
    }

    /**
     * 특정 채팅방 정보를 조회하는 API 엔드포인트
     * @param roomSeq 조회할 채팅방 번호
     * @return 채팅방 정보
     */
    @GetMapping("/{roomSeq}")
    public ResponseEntity<ChatRoomDTO> getRoom(@PathVariable int roomSeq) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        ChatRoomDTO room = chatRoomService.getRoomInfoForUser(roomSeq, empSeq);  // 수정된 부분
        return ResponseEntity.ok(room);
    }

    /**
     * 채팅방을 나가는 API 엔드포인트
     * @param roomSeq 나갈 채팅방 번호
     * @param session HTTP 세션
     * @return 처리 결과
     */
    @PostMapping("/leave/{roomSeq}")
    public ResponseEntity<?> leaveChat(@PathVariable int roomSeq, HttpSession session) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        if (empSeq == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        chatRoomService.leaveChat(roomSeq, empSeq);
        return ResponseEntity.ok().build();
    }
}
