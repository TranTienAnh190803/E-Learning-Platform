package com.TranTienAnh.CoreService.Exceptions;

import com.TranTienAnh.CoreService.DTOs.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(CustomBadRequestException.class)
    public ResponseEntity<Response<Void>> handleBadRequest(CustomBadRequestException ex) {
        Response<Void> response = new Response<>();
        response.setSuccess(false);
        response.setStatusCode(400);
        response.setMessage(ex.getMessage());
        return ResponseEntity.status(400).body(response);
    }

    @ExceptionHandler(CustomNotFoundException.class)
    public ResponseEntity<Response<Void>> handleNotFound(CustomNotFoundException ex) {
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
        log.error("EXCEPTION: ", ex);
        return ResponseEntity.status(500).body(response);
    }
}
