package com.example.projectfinal.util;

import com.example.projectfinal.common.FilterRequest;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;



public class DbUtil {
    private static final DateTimeFormatter DATE_TIME_FM=DateTimeFormatter.ofPattern("dd/MM/yyyy");
    public static <T>Specification<T>createSpecification(FilterRequest input){
        switch (input.getOperator()){
            case EQ:
                return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(input.getField()),
                        castToRequiredType(root.get(input.getField()).getJavaType(), input.getValue()));

            case DGT:
                return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan (root.get(input.getField()), castToLocalDate(input.getValue()));

            case DLT:
                return (root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get(input.getField()), castToLocalDate(input.getValue()));
            case LIKE:
                return (root, query, criteriaBuilder) ->
                        criteriaBuilder.like(criteriaBuilder.upper(root.get(input.getField())), "%" + input.getValue().toUpperCase() + "%");
            default:
                throw new RuntimeException("Unknown operator: " + input.getOperator());
        }
    }

    @SuppressWarnings("unchecked")

    private static Object castToRequiredType(Class fieldType, String value) {
        if(fieldType.isAssignableFrom(Double.class)) {
            return Double.valueOf(value);
        } else if(fieldType.isAssignableFrom(Integer.class)) {
            return Integer.valueOf(value);
        } else if(Enum.class.isAssignableFrom(fieldType)) {
            return Enum.valueOf(fieldType, value);
        }
        return null;
    }
    private static LocalDate castToLocalDate(String value) {
        return LocalDate.parse(value,DATE_TIME_FM);
    }
}
