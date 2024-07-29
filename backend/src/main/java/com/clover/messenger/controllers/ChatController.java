package com.clover.messenger.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.dto.ChatRoomDTO;
import com.clover.messenger.services.ChatService;

@RestController
@RequestMapping("/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    /**
     * 새로운 채팅방을 생성하는 API 엔드포인트
     * @param room 생성할 채팅방 정보
     * @return 생성된 채팅방 정보
     */
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createRoom(@RequestBody ChatRoomDTO room) {
        System.out.println(room.getRoom_seq() + " -> " + room.getRoom_name() + " -> " + room.getRoom_state() + " -> " + room.getRoom_create_time() + room.getRoom_type() + " -> " + room.getEmp_seq());
        ChatRoomDTO createdRoom = chatService.createRoom(room);
        System.out.println(createdRoom.getRoom_seq() + " : " + createdRoom.getRoom_name() + " -> " + createdRoom.getRoom_state() + " -> " + room.getRoom_create_time() + room.getRoom_type() + " -> " + room.getEmp_seq());

        return ResponseEntity.ok(createdRoom);
    }

    /**
     * 사용자를 채팅방에 참여시키는 API 엔드포인트
     * @param roomSeq 참여할 채팅방 번호
     * @param empSeq 참여할 사용자 번호
     * @return 처리 결과
     */
    @PostMapping("/rooms/{roomSeq}/join")
    public ResponseEntity<?> joinRoom(@PathVariable int roomSeq, @RequestBody int empSeq) {
        chatService.addUserToRoom(empSeq, roomSeq);
        return ResponseEntity.ok().build();
    }

    /**
     * 특정 채팅방의 메시지 목록을 조회하는 API 엔드포인트
     * @param roomSeq 조회할 채팅방 번호
     * @return 채팅 메시지 목록
     */
    @GetMapping("/rooms/{roomSeq}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getRoomMessages(@PathVariable int roomSeq) {
        List<ChatMessageDTO> messages = chatService.getRoomMessages(roomSeq);
        return ResponseEntity.ok(messages);
    }

    /**
     * 특정 채팅방 정보를 조회하는 API 엔드포인트
     * @param roomSeq 조회할 채팅방 번호
     * @return 채팅방 정보
     */
    @GetMapping("/rooms/{roomSeq}")
    public ResponseEntity<ChatRoomDTO> getRoom(@PathVariable int roomSeq) {
        ChatRoomDTO room = chatService.getRoomById(roomSeq);
        return ResponseEntity.ok(room);
    }
}