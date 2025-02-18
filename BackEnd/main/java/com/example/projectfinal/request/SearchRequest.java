package com.example.projectfinal.request;

import com.example.projectfinal.common.FilterRequest;
import com.example.projectfinal.common.PageRequest;
import lombok.Data;

import java.util.List;

@Data
public class SearchRequest {
    private PageRequest page=new PageRequest();
    private List<FilterRequest> filters;
private String keyword;
}

