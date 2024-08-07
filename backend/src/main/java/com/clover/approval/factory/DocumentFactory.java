package com.clover.approval.factory;

import org.springframework.stereotype.Component;

import com.clover.approval.dto.BusinessDTO;
import com.clover.approval.dto.DayoffDTO;
import com.clover.approval.dto.DocumentDTO;

@Component
public class DocumentFactory {
    public static DocumentDTO createDocument(String docType) {
        switch (docType) {
            case "business":
                return new BusinessDTO();
            case "dayoff":
                return new DayoffDTO();
            case "업무기안":
            	return new BusinessDTO();
            case "휴가신청서":
            	 return new DayoffDTO();
            default:
                throw new IllegalArgumentException("Unknown docType: " + docType);
        }
    }
}