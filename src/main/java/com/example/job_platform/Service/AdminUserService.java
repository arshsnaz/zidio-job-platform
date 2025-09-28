package com.example.job_platform.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.AdminUserDTO;
import com.example.job_platform.Entity.AdminUser;
import com.example.job_platform.Repository.AdminUserRepository;

@Service
public class AdminUserService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    public List<AdminUserDTO> getAllUsers() {
        return adminUserRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AdminUserDTO blockUser(Long id) {
        AdminUser user = adminUserRepository.findById(id).orElse(null);
        if (user != null) {
            user.setBlocked(true);
            adminUserRepository.save(user);
            return toDTO(user);
        }
        return null;
    }

    public AdminUserDTO unblockUser(Long id) {
        AdminUser user = adminUserRepository.findById(id).orElse(null);
        if (user != null) {
            user.setBlocked(false);
            adminUserRepository.save(user);
            return toDTO(user);
        }
        return null;
    }

    public AdminUserDTO activateUser(Long id) {
        AdminUser user = adminUserRepository.findById(id).orElse(null);
        if (user != null) {
            user.setActive(true);
            adminUserRepository.save(user);
            return toDTO(user);
        }
        return null;
    }

    public AdminUserDTO deactivateUser(Long id) {
        AdminUser user = adminUserRepository.findById(id).orElse(null);
        if (user != null) {
            user.setActive(false);
            adminUserRepository.save(user);
            return toDTO(user);
        }
        return null;
    }

    private AdminUserDTO toDTO(AdminUser user) {
        return new AdminUserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isActive(), user.isBlocked());
    }
}
