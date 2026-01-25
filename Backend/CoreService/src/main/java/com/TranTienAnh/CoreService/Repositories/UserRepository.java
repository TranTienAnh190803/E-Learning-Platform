package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.Models.Entities.User;
import com.TranTienAnh.CoreService.Models.Enums.AccountStatus;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRoleIn(List<Role> roles);

    Optional<User> findByEmailAndStatus(String email, AccountStatus status);

    Optional<User> findByIdAndStatus(Long id, AccountStatus status);
}
