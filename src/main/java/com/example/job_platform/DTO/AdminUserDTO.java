package com.example.job_platform.DTO;

import com.example.job_platform.Enum.Role;

public class AdminUserDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean active;
    private boolean blocked;

    public AdminUserDTO() {
    }

    public AdminUserDTO(Long id, String name, String email, Role role, boolean active, boolean blocked) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.active = active;
        this.blocked = blocked;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }
}
