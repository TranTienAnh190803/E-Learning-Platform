package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.Models.Entities.UserOtp;
import com.TranTienAnh.CoreService.Models.Enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserOtpRepository extends JpaRepository<UserOtp, Long> {
    Optional<UserOtp> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    Optional<UserOtp> findByUserIdAndPurpose(Long userId, OtpPurpose purpose);
}
