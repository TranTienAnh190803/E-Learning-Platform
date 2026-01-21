package com.TranTienAnh.CoreService.Exceptions;

import com.TranTienAnh.CoreService.DTOs.Response;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalException{

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Response<Void>> handleBadRequest(BadRequestException ex) {
        Response<Void> response = new Response<>();
        response.setStatusCode(400);
        response.setSuccess(false);
        response.setMessage(ex.getMessage());

        return  ResponseEntity.status(400).body(response);
    }
}
