package com.TranTienAnh.CoreService.Controllers;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import com.TranTienAnh.CoreService.Services.Interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user-api")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("instructor-registration")
    public ResponseEntity<Response<Void>> instructorRegistration(@RequestBody RegistrationForm registrationForm) {
        Response<Void> response = userService.registration(registrationForm, Role.INSTRUCTOR);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("student-registration")
    public ResponseEntity<Response<Void>> studentRegistration(@RequestBody RegistrationForm registrationForm) {
        Response<Void> response = userService.registration(registrationForm, Role.STUDENT);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("login")
    public ResponseEntity<Response<JwtResponseDto>> login(@RequestBody LoginForm loginForm) {
        Response<JwtResponseDto> response = userService.login(loginForm);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
