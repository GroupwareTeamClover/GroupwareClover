package com.clover.messenger.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clover.messenger.dto.ChatMessageDTO;
import com.clover.messenger.services.ChatMessageService;
import com.clover.messenger.services.ChatRoomService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/chat/messages")
public class ChatMessageController {
    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private HttpSession session;

    /**
     * 특정 채팅방의 메시지 목록을 조회하는 API 엔드포인트
     * @param roomSeq 조회할 채팅방 번호
     * @return 채팅 메시지 목록
     */
    @GetMapping("/{roomSeq}")
    public ResponseEntity<List<ChatMessageDTO>> getRoomMessages(@PathVariable int roomSeq) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        List<ChatMessageDTO> messages = chatMessageService.getRoomMessages(roomSeq, empSeq);
        return ResponseEntity.ok(messages);
    }

    /**
     * 채팅 내역을 삭제하는 API 엔드포인트
     * @param roomSeq 채팅 내역을 삭제할 채팅방 번호
     * @param session HTTP 세션
     * @return 처리 결과
     */
    @DeleteMapping("/clear/{roomSeq}")
    public ResponseEntity<?> clearChatHistory(@PathVariable int roomSeq, HttpSession session) {
        Integer empSeq = (Integer) session.getAttribute("cloverSeq");
        if (empSeq == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        chatRoomService.clearChatHistory(roomSeq, empSeq);
        return ResponseEntity.ok().build();
    }
}
