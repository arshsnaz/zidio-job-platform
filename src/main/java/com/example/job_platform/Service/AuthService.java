package com.example.job_platform.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.AuthResponse;
import com.example.job_platform.DTO.LoginRequest;
import com.example.job_platform.DTO.RegisterRequest;
import com.example.job_platform.Entity.User;
import com.example.job_platform.Entity.Recruiter;
import com.example.job_platform.Entity.Student;
import com.example.job_platform.Enum.Role;
import com.example.job_platform.Repository.UserRepository;
import com.example.job_platform.Repository.RecruiterRepository;
import com.example.job_platform.Repository.StudentRepository;
import com.example.job_platform.Security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RecruiterRepository recruiterRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPassword(passwordEncoder.encode(request.password));
        user.setRole(request.role);
        User savedUser = userRepository.save(user);

        // Create role-specific records
        if (request.role == Role.RECRUITER) {
            Recruiter recruiter = new Recruiter();
            recruiter.setUser(savedUser);
            recruiter.setCompanyName("Company"); // Default company name
            recruiter.setDesignation("Recruiter"); // Default designation
            recruiterRepository.save(recruiter);
        } else if (request.role == Role.STUDENT) {
            Student student = new Student();
            student.setUser(savedUser);
            // Set default values for student
            student.setSkills("Java, Spring Boot"); // Default skills
            student.setEducation("Computer Science"); // Default education
            studentRepository.save(student);
        }
        // Note: AdminUser has different structure, so we skip auto-creation

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, "User Registerd Successful");

    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, "Login Successful");

    }
}
