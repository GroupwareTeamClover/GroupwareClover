package com.clover.board.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.board.dao.BoardlistDAO;

@Service
public class BoardlistService {
	
	@Autowired
	private BoardlistDAO blDao;
	
}
