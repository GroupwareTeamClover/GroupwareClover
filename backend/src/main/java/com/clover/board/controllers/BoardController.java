package com.clover.board.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.board.services.BoardlistService;

@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private BoardlistService blServ;

}
