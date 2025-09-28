package com.example.job_platform.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Entity.Recruiter;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {

    List<JobPost> findByRecruiter(Recruiter recruiter);

    @Query("SELECT j FROM JobPost j WHERE j.recruiter.user.email = :email")
    List<JobPost> findByRecruiterEmail(@Param("email") String email);

    List<JobPost> findByTitleContainingIgnoreCase(String title);

    List<JobPost> findByTypeIgnoreCase(String type);

    @Query("SELECT j FROM JobPost j WHERE j.recruiter.companyName LIKE %:companyName%")
    List<JobPost> findByCompanyNameContaining(@Param("companyName") String companyName);

    List<JobPost> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT j FROM JobPost j WHERE j.title LIKE %:keyword% OR j.description LIKE %:keyword% OR j.location LIKE %:keyword%")
    List<JobPost> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT j FROM JobPost j ORDER BY j.createdAt DESC")
    List<JobPost> findAllOrderByCreatedAtDesc();
}
