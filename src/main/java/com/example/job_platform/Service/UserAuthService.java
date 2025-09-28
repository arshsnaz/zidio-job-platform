package com.example.job_platform.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.AuthResponse;
import com.example.job_platform.DTO.LoginRequest;
import com.example.job_platform.DTO.RegisterRequest;
import com.example.job_platform.Entity.User;
import com.example.job_platform.Repository.UserRepository;
import com.example.job_platform.Security.JwtUtil;

@Service
public class UserAuthService {

    @Autowired
    private UserRepository userRepsitory;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPassword(passwordEncoder.encode(request.password));
        user.setRole(request.role);
        userRepsitory.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
        return new AuthResponse(token, "User Registerd Successful");

    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepsitory.findByEmail(request.email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
        return new AuthResponse(token, "Login Successful");

    }

}
