package com.example.projectfinal.exception;

import com.example.projectfinal.constant.WrapResponseStatus;
import com.example.projectfinal.response.WrapResponse;
import org.hibernate.service.spi.ServiceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class HandleException extends ResponseEntityExceptionHandler {
    @ExceptionHandler(ServiceException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public WrapResponse handleServiceException(ServiceException ex) {
        return WrapResponse.error(WrapResponseStatus.SERVICE_ERROR, ex.getMessage());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return handleExceptionInternal(ex, WrapResponse.error(WrapResponseStatus.BAD_REQUEST, errors.toString()), headers, HttpStatus.BAD_REQUEST, request);
    }
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public WrapResponse resourceException(Exception ex) {
        logger.error(ex.getMessage(), ex);
        return WrapResponse.error(WrapResponseStatus.INTERNAL_SERVER_ERROR, ex.getMessage() == null ?
                "Internal Server Error" : ex.getMessage());
    }
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
public WrapResponse resourceNotFoundException(NotFoundException ex){
        System.err.println("!! Handel error : "+ ex.getMessage());
        return WrapResponse.error(WrapResponseStatus.NOT_FOUND,ex.getMessage());
    }


}
