package com.clover.messenger.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.services.ChatService;
import com.clover.messenger.services.UserSessionService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @Autowired
    private HttpSession session;

    @Autowired
    private UserSessionService userSessionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 채팅방 목록을 조회하는 API 엔드포인트
     * @return 로그인한 사용자의 채팅방 목록
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getChatRooms() {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        List<ChatRoomDTO> rooms = chatService.getChatRoomsWithDetails(empSeq);
        return ResponseEntity.ok(rooms);
    }

    /**
     * 1:1 채팅방을 생성하는 API 엔드포인트.
     * @param targetEmpSeq 대화 상대방의 사원 번호
     * @return 생성된 채팅방 정보
     */

    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createOneToOneRoom(@RequestBody Map<String, Integer> payload) {
        int empSeq = (int) session.getAttribute("cloverSeq");
        int targetEmpSeq = payload.get("targetEmpSeq");
        
        ChatRoomDTO room = chatService.createOneToOneRoom(empSeq, targetEmpSeq);
        
        // 생성자에게 채팅방 정보 전송
        messagingTemplate.convertAndSendToUser(String.valueOf(empSeq), "/queue/newChatRoom", room);
        
        // 타겟 사용자를 위한 채팅방 정보 가져오기
        ChatRoomDTO roomForTarget = chatService.getRoomInfoForUser(room.getRoomSeq(), targetEmpSeq);
        
        // 타겟 사용자에게 채팅방 정보 전송
        messagingTemplate.convertAndSendToUser(String.valueOf(targetEmpSeq), "/queue/targetNewChatRoom", roomForTarget);
        
        return ResponseEntity.ok(room);
    }
    
    @PostMapping("/rooms/group")
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

        ChatRoomDTO room = chatService.createGroupRoom(roomName, creatorSeq, participantSeqs, participants);
        
        // WebSocket을 통해 참가자들에게 새 그룹 채팅방 생성 알림 1 
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
     * 특정 채팅방의 메시지 목록을 조회하는 API 엔드포인트
     * @param roomSeq 조회할 채팅방 번호
     * @return 채팅 메시지 목록
     */
    @GetMapping("/rooms/{roomSeq}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getRoomMessages(@PathVariable int roomSeq) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        List<ChatMessageDTO> messages = chatService.getRoomMessages(roomSeq, empSeq);
        return ResponseEntity.ok(messages);
    }

    /**
     * 특정 채팅방 정보를 조회하는 API 엔드포인트
     * @param roomSeq 조회할 채팅방 번호
     * @return 채팅방 정보
     */
    @GetMapping("/rooms/{roomSeq}")
    public ResponseEntity<ChatRoomDTO> getRoom(@PathVariable int roomSeq) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        ChatRoomDTO room = chatService.getRoomById(roomSeq, empSeq);
        return ResponseEntity.ok(room);
    }

    /**
     * 회사 내 조직도를 조회하는 API 앤드포인트
     * @return 회사 내 조직도11
     */
	@GetMapping("/organization")
	public ResponseEntity<List<HashMap<String, Object>>> getAllData(){

		return ResponseEntity.ok(chatService.getOrganization());
	}

    /**
     * 프로필 정보를 조회하는 API 엔드포인트
     * @param empSeq 조회할 사용자의 사원 번호 (옵션)
     * @return 프로필 정보
     */
    @GetMapping("/profile")
    public ResponseEntity<HashMap<String, Object>> getProfile(@RequestParam(required = false) Integer empSeq, HttpSession session) {
        if (empSeq == null) {
            empSeq = (Integer) session.getAttribute("cloverSeq");
            System.out.println("확인1");
        }
        if (empSeq == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            
        }
        System.out.println("확인2");
        HashMap<String, Object> profile = chatService.getProfile(empSeq);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/online-users")
    public ResponseEntity<List<Map<String, Object>>> getOnlineUsers(HttpSession session) {
        Integer deptCode = (Integer) session.getAttribute("cloverDeptCode");
        if (deptCode == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Map<String, Object>> onlineUsers = userSessionService.getOnlineUsersByDeptCode(deptCode);
        return ResponseEntity.ok(onlineUsers);
    }


}