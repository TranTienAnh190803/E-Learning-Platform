package com.TranTienAnh.CoreService.Exceptions;

import com.TranTienAnh.CoreService.DTOs.Response;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(401);
        response.setContentType("application/json;charset=UTF-8");

        Response<Void> body = new Response<>();
        body.setSuccess(false);
        body.setStatusCode(401);
        body.setMessage("Unauthorized");

        response.getWriter().write(
                objectMapper.writeValueAsString(body)
        );
    }
}
