package com.TranTienAnh.CoreService.Exceptions;

import com.TranTienAnh.CoreService.DTOs.Response;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setStatus(403);
        response.setContentType("application/json;charset=UTF-8");

        Response<Void> body = new Response<>();
        body.setSuccess(false);
        body.setStatusCode(403);
        body.setMessage("Access Denied");

        response.getWriter().write(
                objectMapper.writeValueAsString(body)
        );
    }
}
