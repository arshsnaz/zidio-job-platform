package com.example.job_platform.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.job_platform.Entity.Student;
import com.example.job_platform.Entity.User;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUser(User user);

    @Query("SELECT s FROM Student s WHERE s.user.email = :email")
    Optional<Student> findByUserEmail(@Param("email") String email);

    @Query("SELECT s FROM Student s WHERE s.skills LIKE %:skill%")
    java.util.List<Student> findBySkillsContaining(@Param("skill") String skill);
}
