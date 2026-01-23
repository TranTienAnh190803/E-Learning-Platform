package com.TranTienAnh.CoreService.Controllers;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.DTOs.UserDto;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import com.TranTienAnh.CoreService.Services.Interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("user-api")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("public/instructor-registration")
    public ResponseEntity<Response<Void>> instructorRegistration(@RequestBody RegistrationForm registrationForm) {
        Response<Void> response = userService.registration(registrationForm, Role.INSTRUCTOR);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("public/student-registration")
    public ResponseEntity<Response<Void>> studentRegistration(@RequestBody RegistrationForm registrationForm) {
        Response<Void> response = userService.registration(registrationForm, Role.STUDENT);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("public/login")
    public ResponseEntity<Response<JwtResponseDto>> login(@RequestBody LoginForm loginForm) {
        Response<JwtResponseDto> response = userService.login(loginForm);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("all-user")
    public ResponseEntity<Response<List<UserDto>>> getAll() {
        Response<List<UserDto>> response = userService.getAll();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("profile")
    public ResponseEntity<Response<UserDto>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Response<UserDto> response = userService.getProfile(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("public/otp-forgot-password/{email}")
    public ResponseEntity<Response<Void>> otpForgotPassword(@PathVariable("email") String email) {
        Response<Void> response = userService.sendOtpForgotPassword(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
