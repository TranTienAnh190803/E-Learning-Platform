package com.TranTienAnh.CoreService.Exceptions;

public class CustomBadRequestException extends RuntimeException{
    public CustomBadRequestException(String message) {
        super(message);
    }
}
