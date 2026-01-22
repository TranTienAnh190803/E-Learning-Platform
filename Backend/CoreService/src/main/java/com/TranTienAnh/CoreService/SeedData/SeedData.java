package com.TranTienAnh.CoreService.SeedData;

import com.TranTienAnh.CoreService.Models.Entities.User;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import com.TranTienAnh.CoreService.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Date;

@Component
public class SeedData implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@system.com")) {
            // Tôi sẽ để thông tin Admin trong .env (Tạm thời sẽ để thông tin admin vào trong Code)
            User admin = new User(
                    "Admin",
                    LocalDate.now(),
                    "HaNoi",
                    Role.ADMIN,
                    "admin@system.com",
                    passwordEncoder.encode("12345")
            );

            userRepository.save(admin);
        }
    }
}
