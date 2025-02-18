package com.example.projectfinal.common;

import com.example.projectfinal.constant.QueryOperator;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FilterRequest {
    private String field;
    private String value;
private QueryOperator operator;
}
