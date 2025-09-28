package com.example.job_platform.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.job_platform.Entity.UserPaymentStatus;

@Repository
public interface UserPaymentStatusRepository extends JpaRepository<UserPaymentStatus, Long> {

    Optional<UserPaymentStatus> findByUserId(Long userId);
}
