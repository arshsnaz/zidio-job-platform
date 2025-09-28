package com.example.job_platform.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.DTO.AdminUserDTO;
import com.example.job_platform.Service.AdminUserService;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<AdminUserDTO> activateUser(@PathVariable Long id) {
        AdminUserDTO dto = adminUserService.activateUser(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<AdminUserDTO> deactivateUser(@PathVariable Long id) {
        AdminUserDTO dto = adminUserService.deactivateUser(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<AdminUserDTO> blockUser(@PathVariable Long id) {
        AdminUserDTO dto = adminUserService.blockUser(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<AdminUserDTO> unblockUser(@PathVariable Long id) {
        AdminUserDTO dto = adminUserService.unblockUser(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }
}
