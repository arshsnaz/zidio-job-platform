package com.example.job_platform.Repository;

import com.example.job_platform.Entity.AdminUser;
import com.example.job_platform.Enum.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    List<AdminUser> findByRole(Role role);
}
