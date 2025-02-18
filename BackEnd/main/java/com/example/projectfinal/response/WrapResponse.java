package com.example.projectfinal.response;

import com.example.projectfinal.constant.WrapResponseStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WrapResponse<T> {
    private String statusCode;
    private T data;
    private String message;
    public static <T> WrapResponse<T> ok(T data){

    WrapResponse<T> response = new WrapResponse<>();
    response.setData(data);
    response.setStatusCode(WrapResponseStatus.SUCCESS);
    return  response;}
    public static <T> WrapResponse<T> error(String message){

        WrapResponse<T> response = new WrapResponse<>();
        response.setData(null);
        response.setStatusCode(WrapResponseStatus.INTERNAL_SERVER_ERROR);
        response.setMessage(message);
        return  response;}
    public static <T> WrapResponse<T> error(String statusCode, String message){

        WrapResponse<T> response = new WrapResponse<>();
        response.setData(null);
        response.setStatusCode(statusCode);
        response.setMessage(message);
        return  response;}


}
