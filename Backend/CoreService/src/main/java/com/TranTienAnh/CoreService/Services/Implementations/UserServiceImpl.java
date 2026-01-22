package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.DTOs.UserDto;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Entities.User;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import com.TranTienAnh.CoreService.Repositories.UserRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Response<Void> registration(RegistrationForm registrationForm, Role role) {
        Response<Void> response = new Response<>();

        try {
            if (registrationForm.getPassword().equals(registrationForm.getReEnteredPassword())) {
                User user = new User(
                        registrationForm.getFullName(),
                        registrationForm.getDateOfBirth(),
                        registrationForm.getAddress(),
                        role,
                        registrationForm.getEmail(),
                        passwordEncoder.encode(registrationForm.getPassword())
                );
                User newUser = userRepository.save(user);

                response.setSuccess(true);
                response.setStatusCode(201);
                response.setMessage("Registered Successfully.");
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(400);
                response.setMessage("Your registration password and your re-entered password must match.");
            }

        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @Override
    public Response<JwtResponseDto> login(LoginForm loginForm) {
        Response<JwtResponseDto> response = new Response<>();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginForm.getEmail(), loginForm.getPassword())
        );

        try {
            var user = userRepository.findByEmail(loginForm.getEmail()).orElse(null);
            if (user == null) {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("User information not found");
            }
            else {
                var token = jwtUtil.generateToken(user);
                JwtResponseDto jwtResponseDto = new JwtResponseDto(user.getRole().name(), token);
                response.setSuccess(true);
                response.setStatusCode(200);
                response.setData(jwtResponseDto);
            }
        }
        catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Response<List<UserDto>> getAll() {
        Response<List<UserDto>> response = new Response<>();

        try {
            var userList = userRepository.findByRoleIn(List.of(Role.STUDENT, Role.INSTRUCTOR))
                    .stream()
                    .map(u -> new UserDto(u.getId(), u.getFullName(), u.getDateOfBirth(), u.getAddress(), u.getRole().name(), u.getEmail()))
                    .collect(Collectors.toList());
            response.setStatusCode(200);
            response.setSuccess(true);
            response.setData(userList);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'STUDENT')")
    public Response<UserDto> getProfile(String email) {
        Response<UserDto> response = new Response<>();

        try {
            var user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("User information not found");
            }
            else {
                UserDto userDto = new UserDto(
                        user.getId(),
                        user.getFullName(),
                        user.getDateOfBirth(),
                        user.getAddress(),
                        user.getRole().name(),
                        user.getEmail()
                );

                response.setSuccess(true);
                response.setStatusCode(200);
                response.setData(userDto);
            }

        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }
}
