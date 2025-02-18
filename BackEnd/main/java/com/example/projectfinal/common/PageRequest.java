package com.example.projectfinal.common;

import org.springframework.data.domain.Pageable;

public class PageRequest {
    private int pageNumber = 0;
    private int pageSize = 10;

    public Pageable getPageable() {
        return org.springframework.data.domain.PageRequest.of(pageNumber, pageSize);
    }
}
