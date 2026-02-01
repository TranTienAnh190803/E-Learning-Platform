package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.DTOs.UserDto;
import com.TranTienAnh.CoreService.Models.Entities.User;
import com.TranTienAnh.CoreService.Models.Enums.AccountStatus;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRoleIn(List<Role> roles);

    List<User> findByRole(Role role);

    Optional<User> findByEmailAndStatus(String email, AccountStatus status);

    Optional<User> findByIdAndStatus(Long id, AccountStatus status);

    @Query("""
            SELECT u
            FROM User u
            WHERE u.email LIKE CONCAT('%', :email, '%')
            """)
    List<User> searchUser(@Param("email") String email);
}
