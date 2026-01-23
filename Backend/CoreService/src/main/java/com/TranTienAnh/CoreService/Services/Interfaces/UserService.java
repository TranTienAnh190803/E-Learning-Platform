package com.TranTienAnh.CoreService.Services.Interfaces;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.DTOs.UserDto;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Enums.Role;

import java.util.List;

public interface UserService {
    Response<Void> registration(RegistrationForm registrationForm, Role role);

    Response<JwtResponseDto> login(LoginForm loginForm);

    Response<List<UserDto>> getAll();

    Response<UserDto> getProfile(String email);

    Response<Void> sendOtpForgotPassword(String email);
}
