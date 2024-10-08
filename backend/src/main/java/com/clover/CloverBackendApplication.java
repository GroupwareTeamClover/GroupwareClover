package com.clover;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CloverBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CloverBackendApplication.class, args);
	}

}