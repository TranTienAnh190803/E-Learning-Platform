package com.TranTienAnh.CoreService.Exceptions;

import com.TranTienAnh.CoreService.DTOs.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomBadRequestException.class)
    public ResponseEntity<Response<Void>> handleBadRequest(CustomBadRequestException ex) {
        Response<Void> response = new Response<>();
        response.setSuccess(false);
        response.setStatusCode(400);
        response.setMessage(ex.getMessage());
        return ResponseEntity.status(400).body(response);
    }

    @ExceptionHandler(CustomNotFoundException.class)
    public ResponseEntity<Response<Void>> handleNotFound(CustomBadRequestException ex) {
        Response<Void> response = new Response<>();
        response.setSuccess(false);
        response.setStatusCode(404);
        response.setMessage(ex.getMessage());
        return ResponseEntity.status(404).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response<Void>> handleException(Exception ex) {
        Response<Void> response = new Response<>();
        response.setSuccess(false);
        response.setStatusCode(500);
        response.setMessage(ex.getMessage());
        return ResponseEntity.status(500).body(response);
    }
}
