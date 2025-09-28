package com.example.job_platform.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.RecruiterDTO;
import com.example.job_platform.Entity.Recruiter;
import com.example.job_platform.Entity.User;
import com.example.job_platform.Repository.RecruiterRepository;
import com.example.job_platform.Repository.UserRepository;

@Service
public class RecruiterService {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private UserRepository userRepository;

    public RecruiterDTO createOrUpdateRecruiter(RecruiterDTO dto) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
            if (!userOpt.isPresent()) {
                throw new RuntimeException("User not found with email: " + dto.getEmail());
            }

            User user = userOpt.get();
            Recruiter recruiter = recruiterRepository.findByUser(user).orElse(new Recruiter());

            recruiter.setUser(user);
            recruiter.setCompanyName(dto.getCompanyName());
            recruiter.setDesignation(dto.getDesignation());

            Recruiter savedRecruiter = recruiterRepository.save(recruiter);
            return mapToDTO(savedRecruiter);

        } catch (Exception e) {
            throw new RuntimeException("Error creating/updating recruiter: " + e.getMessage());
        }
    }

    public RecruiterDTO getRecruiterByEmail(String email) {
        try {
            Optional<Recruiter> recruiter = recruiterRepository.findByUserEmail(email);
            if (!recruiter.isPresent()) {
                throw new RuntimeException("Recruiter not found with email: " + email);
            }
            return mapToDTO(recruiter.get());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching recruiter: " + e.getMessage());
        }
    }

    public RecruiterDTO getRecruiterById(Long id) {
        try {
            Optional<Recruiter> recruiter = recruiterRepository.findById(id);
            if (!recruiter.isPresent()) {
                throw new RuntimeException("Recruiter not found with id: " + id);
            }
            return mapToDTO(recruiter.get());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching recruiter: " + e.getMessage());
        }
    }

    private RecruiterDTO mapToDTO(Recruiter recruiter) {
        RecruiterDTO dto = new RecruiterDTO();
        dto.setId(recruiter.getId());
        dto.setName(recruiter.getUser().getName());
        dto.setEmail(recruiter.getUser().getEmail());
        dto.setCompanyName(recruiter.getCompanyName());
        dto.setDesignation(recruiter.getDesignation());
        return dto;
    }
}
