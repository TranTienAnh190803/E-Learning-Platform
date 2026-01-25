package com.TranTienAnh.CoreService.Controllers;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.DTOs.UserDto;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.PasswordChangingForm;
import com.TranTienAnh.CoreService.Forms.ProfileChangingForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Enums.AccountStatus;
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

    @PostMapping("public/verify-registration-email/{email}/{otp}")
    public ResponseEntity<Response<Void>> studentRegistration(@PathVariable("email") String email, @PathVariable("otp") String otp) {
        Response<Void> response = userService.verifyRegistrationEmail(email, otp);
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
        assert authentication != null;
        String email = authentication.getName();
        Response<UserDto> response = userService.getProfile(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("public/otp-forgot-password/{email}")
    public ResponseEntity<Response<Void>> otpForgotPassword(@PathVariable("email") String email) {
        Response<Void> response = userService.sendOtpForgotPassword(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("public/verify-otp-forgot-password/{email}/{otp}")
    public ResponseEntity<Response<Void>> verifyForgottenPasswordOtp(@PathVariable("email") String email, @PathVariable("otp") String otp) {
        Response<Void> response = userService.verifyForgottenPasswordOtp(email, otp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PatchMapping("public/change-forgotten-password{email}/{otp}")
    public ResponseEntity<Response<Void>> changeForgottenPassword(@PathVariable("email") String email, @PathVariable("otp") String otp, @RequestBody PasswordChangingForm passwordChangingForm) {
        Response<Void> response = userService.changeForgottenPassword(email, otp, passwordChangingForm);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PatchMapping("change-password/{oldPassword}")
    public ResponseEntity<Response<Void>> changePassword(@PathVariable("oldPassword") String oldPassword, @RequestBody PasswordChangingForm passwordChangingForm) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<Void> response = userService.changePassword(email, oldPassword, passwordChangingForm);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("change-profile")
    public ResponseEntity<Response<Void>> changeProfile(@RequestBody ProfileChangingForm profileChangingForm) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<Void> response = userService.changeProfile(email, profileChangingForm);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PatchMapping("disable-account/{userId}")
    public ResponseEntity<Response<Void>> disableAccount(@PathVariable("userId") Long userId) {
        Response<Void> response = userService.controlAccount(userId, AccountStatus.DISABLE);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PatchMapping("enable-account/{userId}")
    public ResponseEntity<Response<Void>> enableAccount(@PathVariable("userId") Long userId) {
        Response<Void> response = userService.controlAccount(userId, AccountStatus.ACTIVE);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("delete-account/{userId}")
    public ResponseEntity<Response<Void>> deleteAccount(@PathVariable("userId") Long userId) {
        Response<Void> response = userService.deleteAccount(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
