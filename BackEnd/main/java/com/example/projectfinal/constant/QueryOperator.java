package com.example.projectfinal.constant;

public enum QueryOperator {
    EQ("EQUALS"),
    GT("GREATER_THAN"),
    LT("LESS_THAN"),
    GTE("GREATER_THAN_OR_EQUALS"),
    LTE("LESS_THAN_OR_EQUALS"),
    LIKE("LIKE"),
    DGT("DATE_GREATER_THAN"),
    DLT("DATE_LESS_THAN"),
    DGTE("DATE_GREATER_THAN_OR_EQUALS"),
    DLTE("DATE_LESS_THAN_OR_EQUALS");
    QueryOperator(String value){}
}
