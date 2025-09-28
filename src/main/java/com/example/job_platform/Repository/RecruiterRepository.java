package com.example.job_platform.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.job_platform.Entity.Recruiter;
import com.example.job_platform.Entity.User;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {

    Optional<Recruiter> findByUser(User user);

    @Query("SELECT r FROM Recruiter r WHERE r.user.email = :email")
    Optional<Recruiter> findByUserEmail(@Param("email") String email);

    List<Recruiter> findByCompanyNameContainingIgnoreCase(String companyName);
}
