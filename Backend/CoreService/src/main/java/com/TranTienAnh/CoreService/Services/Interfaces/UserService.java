package com.TranTienAnh.CoreService.Services.Interfaces;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.DTOs.UserDto;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.PasswordChangingForm;
import com.TranTienAnh.CoreService.Forms.ProfileChangingForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Enums.AccountStatus;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    Response<Void> registration(RegistrationForm registrationForm, Role role);

    Response<JwtResponseDto> login(LoginForm loginForm);

    Response<List<UserDto>> getAll();

    Response<UserDto> getProfile(String email);

    Response<Void> sendOtpForgotPassword(String email);

    Response<Void> verifyForgottenPasswordOtp(String email, String otp);

    Response<Void> changeForgottenPassword(String email, String otp, PasswordChangingForm passwordChangingForm);

    Response<Void> changePassword(String email, String oldPassword, PasswordChangingForm passwordChangingForm);

    Response<Void> changeProfile(String email, ProfileChangingForm profileChangingForm);

    Response<Void> controlAccount(Long userId, AccountStatus accountStatus);

    Response<Void> deleteAccount(Long userId);

    Response<Void> verifyRegistrationEmail(String email, String otp);

    Response<List<UserDto>> searchAccount(String email);

    Response<List<UserDto>> filterAccount(Role role);

    Response<Void> uploadAvatar(MultipartFile file, String email) throws IOException;

    Response<Void> otpChangeEmail(String email) throws Exception;

    Response<Void> verifyChangeEmail(String email, String otpCode, String newEmail);

    Response<Void> deleteUserAccount(String email);
}
