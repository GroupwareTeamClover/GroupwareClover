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
     * 채팅방 목록을 조회하는 API 엔드포인트
     * @return 채팅방 목록
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getChatRooms() {
        List<ChatRoomDTO> rooms = chatService.getChatRooms();
        return ResponseEntity.ok(rooms);
    }

    /**
     * 1:1 채팅방을 생성하는 API 엔드포인트
     * @param empSeq 대화 상대방의 사원 번호
     * @return 생성된 채팅방 정보
     */
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createOneToOneRoom(@RequestBody int empSeq) {
        ChatRoomDTO room = chatService.createOneToOneRoom(empSeq);
        return ResponseEntity.ok(room);
    }


    /**
     * 사용자를 채팅방에 참여시키는 API 엔드포인트
     * @param roomSeq 참여할 채팅방 번호
     * @param empSeq 참여할 사용자 번호
     * @return 처리 결과
     */
    // join은 동사인데 RestFul API 법칙에 어긋나는 것 같다. 대체 없을까.
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
    // ID로 가져올 필요 없이 소속된 room 번호만 가져오면 됨.
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
    // 룸아이디로 채팅방 정보 조회.
    @GetMapping("/rooms/{roomSeq}")
    public ResponseEntity<ChatRoomDTO> getRoom(@PathVariable int roomSeq) {
        ChatRoomDTO room = chatService.getRoomById(roomSeq);
        return ResponseEntity.ok(room);
    }
}