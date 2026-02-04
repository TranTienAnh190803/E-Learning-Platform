package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.DTOs.JwtResponseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.DTOs.UserDto;
import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Exceptions.CustomNotFoundException;
import com.TranTienAnh.CoreService.Forms.LoginForm;
import com.TranTienAnh.CoreService.Forms.PasswordChangingForm;
import com.TranTienAnh.CoreService.Forms.ProfileChangingForm;
import com.TranTienAnh.CoreService.Forms.RegistrationForm;
import com.TranTienAnh.CoreService.Models.Entities.User;
import com.TranTienAnh.CoreService.Models.Entities.UserOtp;
import com.TranTienAnh.CoreService.Models.Enums.AccountStatus;
import com.TranTienAnh.CoreService.Models.Enums.OtpPurpose;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import com.TranTienAnh.CoreService.Repositories.UserOtpRepository;
import com.TranTienAnh.CoreService.Repositories.UserRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.FileService;
import com.TranTienAnh.CoreService.Services.Interfaces.UserOtpService;
import com.TranTienAnh.CoreService.Services.Interfaces.UserService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
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

    @Autowired
    private FileService fileService;

    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    @Transactional
    public Response<Void> registration(RegistrationForm registrationForm, Role role) {
        Response<Void> response = new Response<>();

        if (!registrationForm.getPassword().equals(registrationForm.getReEnteredPassword())) {
            throw new CustomBadRequestException("Password does not match");
        }

        var user = userRepository.findByEmail(registrationForm.getEmail()).orElse(null);
        String emailOtp = "";

        // Có 2 trường hợp đăng ký
        // 1. Tài khoản chưa tồn tại trong CSDL (chưa từng đăng ký): Tạo tài khoản mới và OTP trong CSDL
        // 2. Tài khoản đã tồn tại trong CSDL nhưng trạng tái PENDING (đăng ký nhưng chưa xác thực OTP):
        //      2.1. OTP của tài khoản liên kết chưa tồn tại trong CSDL => tạo OTP để xác thực
        //      2.2. OTP của tài khoản liên kết đã tồn tại trong CSDL => sửa mã OTP và TG hết hạn
        if (user == null) {
            User newUser = new User(
                    registrationForm.getFullName(),
                    registrationForm.getGender(),
                    registrationForm.getDateOfBirth(),
                    registrationForm.getAddress(),
                    role,
                    registrationForm.getEmail(),
                    passwordEncoder.encode(registrationForm.getPassword()),
                    AccountStatus.PENDING
            );
            userRepository.save(newUser);

            UserOtp otp = new UserOtp(
                    userOtpService.GenerateOtp(),
                    false,
                    LocalDateTime.now().plusMinutes(2),
                    OtpPurpose.VERIFY_EMAIL,
                    newUser
            );
            userOtpRepository.save(otp);

            emailOtp = otp.getOtpCode();
            response.setSuccess(true);
            response.setStatusCode(201);
            response.setMessage("Please check your mail for OTP.");
        }
        else if (user.getStatus() == AccountStatus.PENDING) {
            // Lưu thông tin mới của user đăng ký lại
            user.setAddress(registrationForm.getAddress());
            user.setGender(registrationForm.getGender());
            user.setDateOfBirth(registrationForm.getDateOfBirth());
            user.setFullName(registrationForm.getFullName());
            user.setRole(role);
            userRepository.save(user);

            var otp = userOtpRepository.findByUserIdAndPurpose(user.getId(), OtpPurpose.VERIFY_EMAIL).orElse(null);
            if (otp == null) {
                UserOtp newOtp = new UserOtp(
                        userOtpService.GenerateOtp(),
                        false,
                        LocalDateTime.now().plusMinutes(2),
                        OtpPurpose.VERIFY_EMAIL,
                        user
                );
                userOtpRepository.save(newOtp);
                emailOtp = newOtp.getOtpCode();
            }
            else {
                otp.setOtpCode(userOtpService.GenerateOtp());
                otp.setExpiredTime(LocalDateTime.now().plusMinutes(2));
                userOtpRepository.save(otp);
                emailOtp = otp.getOtpCode();
            }

            response.setSuccess(true);
            response.setStatusCode(201);
            response.setMessage("Please check your mail for OTP.");
        }
        else {
            throw new CustomBadRequestException("The email has already been used.");
        }

        // Gửi Mail
        try {
            String template = mailService.loadHtmlTemplate("OtpVerifyEmailTemplate.html");
            template = template.replace("{{OtpCode}}", emailOtp);
            mailService.sendMail(
                    "elearning@system.com",
                    registrationForm.getEmail(),
                    "Verify Email OTP",
                    template
            );
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
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
            if (user != null && user.getStatus() == AccountStatus.ACTIVE) {
                var token = jwtUtil.generateToken(user);
                JwtResponseDto jwtResponseDto = new JwtResponseDto(user.getRole().name(), token);
                response.setSuccess(true);
                response.setStatusCode(200);
                response.setData(jwtResponseDto);
            }
            else if (user != null && user.getStatus() == AccountStatus.DISABLE) {
                response.setSuccess(false);
                response.setStatusCode(400);
                response.setMessage("Your account has been disabled.");
            }
            else {
                response.setSuccess(false);
                response.setStatusCode(404);
                response.setMessage("User information not found");
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
                    .map(u -> {
                        String avatar = null;
                        if (u.getAvatarPath() != null && !u.getAvatarPath().isBlank()) {
                            avatar = baseUrl + "/" + u.getAvatarPath();
                        }
                        return new UserDto(u.getId(), u.getFullName(), u.getGender(), u.getDateOfBirth(), u.getAddress(), u.getRole().name(), u.getEmail(), u.getStatus().name(), u.getStatus().getValue(), avatar);
                    })
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
                String avatar = null;
                if (user.getAvatarPath() != null && !user.getAvatarPath().isBlank())
                    avatar = baseUrl + "/" + user.getAvatarPath();

                UserDto userDto = new UserDto(
                        user.getId(),
                        user.getFullName(),
                        user.getGender(),
                        user.getDateOfBirth(),
                        user.getAddress(),
                        user.getRole().name(),
                        user.getEmail(),
                        user.getStatus().name(),
                        user.getStatus().getValue(),
                        avatar
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
                var userOtp = userOtpRepository.findByUserIdAndPurpose(user.getId(), OtpPurpose.FORGOT_PASSWORD).orElse(null);
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
                    userOtpRepository.save(userOtp);
                    otpCode = userOtp.getOtpCode();
                }

                // Gưi mail
                String template = mailService.loadHtmlTemplate("OtpChangePasswordTemplate.html");
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
    @Transactional
    public Response<Void> changeForgottenPassword(String email, String otp, PasswordChangingForm passwordChangingForm) {
        Response<Void> response = new Response<>();

        if (!passwordChangingForm.getNewPassword().equals(passwordChangingForm.getReEnteredPassword())) {
            response.setSuccess(false);
            response.setStatusCode(400);
            response.setMessage("Your new password and your re-entered password must match.");
            return response;
        }

        var user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            var userOtp = userOtpRepository.findByUserIdAndPurpose(user.getId(), OtpPurpose.FORGOT_PASSWORD).orElse(null);
            if (userOtp != null && userOtp.getVerified() && !LocalDateTime.now().isAfter(userOtp.getExpiredTime().plusMinutes(2))) {
                user.setPassword(passwordEncoder.encode(passwordChangingForm.getNewPassword()));
                userRepository.save(user);

                userOtpRepository.delete(userOtp);

                response.setSuccess(true);
                response.setStatusCode(200);
                response.setMessage("Change password successfully.");
            }
            else if (userOtp != null && LocalDateTime.now().isAfter(userOtp.getExpiredTime().plusMinutes(2))) {
                throw new CustomBadRequestException("The password change deadline has passed. Please get new OTP to verify.");
            }
            else {
                throw new CustomBadRequestException("Can not change password (OTP haven't verified).");
            }
        }
        else {
            throw new CustomNotFoundException("Can not find User.");
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
    public Response<Void> controlAccount(Long userId, AccountStatus status) {
        Response<Void> response = new Response<>();

        var user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setStatus(status);
            userRepository.save(user);

            response.setSuccess(true);
            response.setStatusCode(200);
            response.setMessage(status == AccountStatus.ACTIVE ? "Enable account successfully" : "Disabled account successfully");
        }
        else {
            throw new CustomNotFoundException("User not found.");
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

    @Override
    @Transactional
    public Response<Void> verifyRegistrationEmail(String email, String otp) {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found"));
        var userOtp = userOtpRepository.findByUserIdAndPurpose(user.getId(), OtpPurpose.VERIFY_EMAIL).orElseThrow(() -> new RuntimeException("Something wrong, please re-register."));
        if (user.getStatus() == AccountStatus.PENDING && otp.equals(userOtp.getOtpCode()) && !LocalDateTime.now().isAfter(userOtp.getExpiredTime())) {
            user.setStatus(AccountStatus.ACTIVE);
            userRepository.save(user);

            userOtpRepository.delete(userOtp);

            response.setStatusCode(200);
            response.setSuccess(true);
            response.setMessage("Your account have been successfully registered.");
        }
        else if (!otp.equals(userOtp.getOtpCode())) {
            throw new CustomBadRequestException("Wrong OTP.");
        }
        else if (LocalDateTime.now().isAfter(userOtp.getExpiredTime())) {
            throw new CustomBadRequestException("Your OTP has expired.");
        }
        else {
            throw new CustomBadRequestException("Cannot verify account that already exist in the system.");
        }

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Response<List<UserDto>> searchAccount(String email) {
        Response<List<UserDto>> response = new Response<>();

        var result = userRepository.searchUser(email).stream()
                .map(u -> {
                    String avatar = null;
                    if (u.getAvatarPath() != null && !u.getAvatarPath().isBlank())
                        avatar = baseUrl + "/" + u.getAvatarPath();
                    return new UserDto(u.getId(), u.getFullName(), u.getGender(), u.getDateOfBirth(), u.getAddress(), u.getRole().name(), u.getEmail(), u.getStatus().name(), u.getStatus().getValue(), avatar);
                })
                .toList();

        response.setStatusCode(200);
        response.setSuccess(true);
        response.setData(result);


        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Response<List<UserDto>> filterAccount(Role role) {
        Response<List<UserDto>> response = new Response<>();

        var result = userRepository.findByRole(role).stream()
                .map(u -> {
                    String avatar = null;
                    if (u.getAvatarPath() != null && !u.getAvatarPath().isBlank())
                        avatar = baseUrl + "/" + u.getAvatarPath();
                    return new UserDto(u.getId(), u.getFullName(), u.getGender(), u.getDateOfBirth(), u.getAddress(), u.getRole().name(), u.getEmail(), u.getStatus().name(), u.getStatus().getValue(), avatar);
                })
                .toList();

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(result);

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'STUDENT')")
    public Response<Void> uploadAvatar(MultipartFile file, String email) throws IOException {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        String path = fileService.saveAvatar(file, user.getId());

        user.setAvatarPath(path);
        userRepository.save(user);

        response.setStatusCode(200);
        response.setSuccess(true);
        response.setMessage("Upload avatar successfully");

        return response;
    }
}
