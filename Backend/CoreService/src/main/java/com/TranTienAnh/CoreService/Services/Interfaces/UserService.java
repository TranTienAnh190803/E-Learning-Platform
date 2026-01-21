package com.TranTienAnh.CoreService.Services.Interfaces;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Enums.Role;

public interface UserService {
    Response<Void> registration(RegistrationForm registrationForm, Role role);

    Response<JwtResponseDto> login(LoginForm loginForm);
}
