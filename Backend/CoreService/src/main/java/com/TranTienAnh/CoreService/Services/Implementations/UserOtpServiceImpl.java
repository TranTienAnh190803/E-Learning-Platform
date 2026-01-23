package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.Services.Interfaces.UserOtpService;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class UserOtpServiceImpl implements UserOtpService {
    @Override
    public String GenerateOtp() {
        int number = ThreadLocalRandom.current().nextInt(0, 1000000);
        return String.format("%06d", number);
    }
}
