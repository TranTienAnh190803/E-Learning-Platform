package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.DTOs.UserDto;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.PasswordChangingForm;
import com.TranTienAnh.CoreService.Forms.ProfileChangingForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Entities.User;
import com.TranTienAnh.CoreService.Models.Entities.UserOtp;
import com.TranTienAnh.CoreService.Models.Enums.OtpPurpose;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import com.TranTienAnh.CoreService.Repositories.UserOtpRepository;
import com.TranTienAnh.CoreService.Repositories.UserRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.UserOtpService;
import com.TranTienAnh.CoreService.Services.Interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserOtpRepository userOtpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserOtpService userOtpService;

    @Override
    public Response<Void> registration(RegistrationForm registrationForm, Role role) {
        Response<Void> response = new Response<>();

        try {
            if (registrationForm.getPassword().equals(registrationForm.getReEnteredPassword())) {
                User user = new User(
                        registrationForm.getFullName(),
                        registrationForm.getGender(),
                        registrationForm.getDateOfBirth(),
                        registrationForm.getAddress(),
                        role,
                        registrationForm.getEmail(),
                        passwordEncoder.encode(registrationForm.getPassword()),
                        true
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
            if (user != null && user.getActive()) {
                var token = jwtUtil.generateToken(user);
                JwtResponseDto jwtResponseDto = new JwtResponseDto(user.getRole().name(), token);
                response.setSuccess(true);
                response.setStatusCode(200);
                response.setData(jwtResponseDto);
            }
            else if (user == null) {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("User information not found");
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(400);
                response.setMessage("Your account has been disabled.");
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
                    .map(u -> new UserDto(u.getId(), u.getFullName(), u.getGender(), u.getDateOfBirth(), u.getAddress(), u.getRole().name(), u.getEmail(), u.getActive()))
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
                        user.getGender(),
                        user.getDateOfBirth(),
                        user.getAddress(),
                        user.getRole().name(),
                        user.getEmail(),
                        user.getActive()
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

    @Override
    public Response<Void> sendOtpForgotPassword(String email) {
        Response<Void> response = new Response<>();

        try {
            var user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                // Kiểm tra user này đã có Otp trong CSDL chưa (chưa có -> tạo, có rồi -> sửa)
                var userOtp = userOtpRepository.findByUserId(user.getId()).orElse(null);
                String otpCode = "";
                if (userOtp == null) {
                    // Tạo OTP và lưu vào CSDL
                    var otp = new UserOtp(
                            userOtpService.GenerateOtp(),
                            false,
                            LocalDateTime.now().plusMinutes(2),
                            OtpPurpose.FORGOT_PASSWORD,
                            user
                    );
                    userOtpRepository.save(otp);
                    otpCode = otp.getOtpCode();
                }
                else {
                    userOtp.setOtpCode(userOtpService.GenerateOtp());
                    userOtp.setExpiredTime(LocalDateTime.now().plusMinutes(2));
                    userOtp.setPurpose(OtpPurpose.FORGOT_PASSWORD);
                    userOtpRepository.save(userOtp);
                    otpCode = userOtp.getOtpCode();
                }

                // Gưi mail
                String template = mailService.loadHtmlTemplate("OtpTemplate.html");
                template = template.replace("{{OtpCode}}", otpCode);
                mailService.sendMail(
                        "elearning@system.com",
                        email,
                        "Forgot Password OTP",
                        template
                );

                response.setSuccess(true);
                response.setStatusCode(200);
                response.setMessage("Please check your mail to get OTP.");
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(400);
                response.setMessage("Your email address is not registered in the system.");
            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @Override
    public Response<Void> verifyForgottenPasswordOtp(String email, String otp) {
        Response<Void> response = new Response<>();

        try {
            var user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                var userOtp = userOtpRepository.findByUserIdAndPurpose(user.getId(), OtpPurpose.FORGOT_PASSWORD).orElse(null);
                if (userOtp != null && userOtp.getOtpCode().equals(otp) && !userOtp.getVerified() && !LocalDateTime.now().isAfter(userOtp.getExpiredTime())) {
                    userOtp.setVerified(true);
                    userOtpRepository.save(userOtp);

                    response.setSuccess(true);
                    response.setStatusCode(200);
                    response.setMessage("Verified OTP Successfully.");
                }
                else if (userOtp != null && !userOtp.getOtpCode().equals(otp)) {
                    response.setSuccess(false);
                    response.setStatusCode(400);
                    response.setMessage("Wrong OTP.");
                }
                else if (userOtp != null && userOtp.getVerified()) {
                    response.setSuccess(false);
                    response.setStatusCode(400);
                    response.setMessage("This OTP has been verified.");
                }
                else if (userOtp != null && LocalDateTime.now().isAfter(userOtp.getExpiredTime())) {
                    response.setSuccess(false);
                    response.setStatusCode(400);
                    response.setMessage("This OTP has expired.");
                } else {
                    response.setSuccess(false);
                    response.setStatusCode(400);
                    response.setMessage("Wrong OTP.");
                }
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("Can not find User.");
            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @Override
    public Response<Void> changeForgottenPassword(String email, String otp, PasswordChangingForm passwordChangingForm) {
        Response<Void> response = new Response<>();

        if (!passwordChangingForm.getNewPassword().equals(passwordChangingForm.getReEnteredPassword())) {
            response.setSuccess(false);
            response.setStatusCode(400);
            response.setMessage("Your new password and your re-entered password must match.");
            return response;
        }

        try {
            var user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                var userOtp = userOtpRepository.findByUserIdAndPurpose(user.getId(), OtpPurpose.FORGOT_PASSWORD).orElse(null);
                if (userOtp != null && userOtp.getVerified()) {
                    user.setPassword(passwordEncoder.encode(passwordChangingForm.getNewPassword()));
                    userRepository.save(user);

                    response.setSuccess(true);
                    response.setStatusCode(200);
                    response.setMessage("Change password successfully.");
                }
                else {
                    response.setSuccess(false);
                    response.setStatusCode(400);
                    response.setMessage("Can not change password (OTP haven't verified).");
                }
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("Can not find User.");
            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'STUDENT')")
    @Override
    public Response<Void> changePassword(String email, String oldPassword, PasswordChangingForm passwordChangingForm) {
        Response<Void> response = new Response<>();

        if (!passwordChangingForm.getNewPassword().equals(passwordChangingForm.getReEnteredPassword())) {
            response.setSuccess(false);
            response.setStatusCode(400);
            response.setMessage("Your new password and your re-entered password must match.");
            return response;
        }

        try {
            var user = userRepository.findByEmail(email).orElse(null);
            if (user != null && passwordEncoder.matches(oldPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(passwordChangingForm.getNewPassword()));
                userRepository.save(user);

                response.setSuccess(true);
                response.setStatusCode(200);
                response.setMessage("Change password successfully.");
            }
            else if (user == null) {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("User not found.");
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(400);
                response.setMessage("Wrong old password.");
            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'STUDENT')")
    @Override
    public Response<Void> changeProfile(String email, ProfileChangingForm profileChangingForm) {
        Response<Void> response = new Response<>();

        try {
            var user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                user.setFullName(profileChangingForm.getFullName());
                user.setDateOfBirth(profileChangingForm.getDateOfBirth());
                user.setGender(profileChangingForm.getGender());
                user.setAddress(profileChangingForm.getAddress());
                userRepository.save(user);

                response.setSuccess(true);
                response.setStatusCode(200);
                response.setMessage("Update profile successfully");
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("User not found.");
            }
        }
        catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @Override
    public Response<Void> controlAccount(Long userId, Boolean isActive) {
        Response<Void> response = new Response<>();

        try {
            var user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setActive(isActive);
                userRepository.save(user);

                response.setSuccess(true);
                response.setStatusCode(200);
                response.setMessage(isActive ? "Enable account successfully" : "Disabled account successfully");
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("User not found.");
            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @Override
    public Response<Void> deleteAccount(Long userId) {
        Response<Void> response = new Response<>();

        try {
            var user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getRole() != Role.ADMIN) {
                userRepository.delete(user);

                response.setSuccess(true);
                response.setStatusCode(200);
                response.setMessage("Deleted account successfully");
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("User not found.");
            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }
}
