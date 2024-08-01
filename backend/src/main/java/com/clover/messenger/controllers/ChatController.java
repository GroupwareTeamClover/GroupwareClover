package com.clover.messenger.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.services.ChatService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @Autowired
    private HttpSession session;



    /**
     * 채팅방 목록을 조회하는 API 엔드포인트
     * @return 로그인한 사용자의 채팅방 목록
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getChatRooms() {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        List<ChatRoomDTO> rooms = chatService.getChatRooms(empSeq);
        return ResponseEntity.ok(rooms);
    }

    /**
     * 1:1 채팅방을 생성하는 API 엔드포인트
     * @param targetEmpSeq 대화 상대방의 사원 번호
     * @return 생성된 채팅방 정보
     */
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createOneToOneRoom(@RequestBody Map<String, Integer> payload) {
        int empSeq = (int) session.getAttribute("cloverSeq");        
        int targetEmpSeq = payload.get("targetEmpSeq");        
        ChatRoomDTO room = chatService.createOneToOneRoom(empSeq, targetEmpSeq);
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
     * 온라인 사용자 목록을 조회하는 API 엔드포인트
     * @return 온라인 사용자 목록
     */
    // @GetMapping("/online-users")
    // public ResponseEntity<List<EmployeeDTO>> getOnlineUsers() {
    //     Object test = session.getAttribute("cloverSeq");
    //     System.out.println("테스트" + test);
    //     Integer empSeq = (Integer) session.getAttribute("cloverSeq");
    //     List<EmployeeDTO> onlineUsers = chatService.getOnlineUsers(empSeq);
    //     return ResponseEntity.ok(onlineUsers);
    // }

    /**
     * 회사 내 조직도를 조회하는 API 앤드포인트
     * @return 회사 내 조직도
     */
	@GetMapping("/organization")
	public ResponseEntity<List<HashMap<String, Object>>> getAllData(){

		return ResponseEntity.ok(chatService.getOrganization());
	}

    /**
     * 현재 로그인한 사용자의 프로필 정보를 조회하는 API 엔드포인트
     * @return 로그인한 사용자의 프로필 정보
     */    
    @GetMapping("/profile")
    public ResponseEntity<HashMap<String, Object>> getProfile() {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        HashMap<String, Object> profile = chatService.getProfile(empSeq);
        return ResponseEntity.ok(profile);
    }
}