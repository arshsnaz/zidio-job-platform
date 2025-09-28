package com.example.job_platform.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.job_platform.Entity.Application;
import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Entity.Student;
import com.example.job_platform.Enum.Status;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudent(Student student);

    List<Application> findByJob(JobPost job);

    @Query("SELECT a FROM Application a WHERE a.student.user.email = :email")
    List<Application> findByStudentEmail(@Param("email") String email);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.user.email = :email")
    List<Application> findByRecruiterEmail(@Param("email") String email);

    List<Application> findByStatus(Status status);

    @Query("SELECT a FROM Application a WHERE a.student = :student AND a.job = :job")
    Application findByStudentAndJob(@Param("student") Student student, @Param("job") JobPost job);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.recruiter.user.email = :recruiterEmail")
    long countApplicationsByRecruiterEmail(@Param("recruiterEmail") String recruiterEmail);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.student.user.email = :studentEmail")
    long countApplicationsByStudentEmail(@Param("studentEmail") String studentEmail);
}
