package com.example.job_platform.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.Entity.User;
import com.example.job_platform.Repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("name", user.getName());
            profile.put("email", user.getEmail());
            profile.put("role", user.getRole().name());
            profile.put("status", user.isStatus());

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateUserProfile(@RequestBody Map<String, Object> profileData) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (profileData.containsKey("name")) {
                user.setName((String) profileData.get("name"));
            }

            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", getUserProfileData(user));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getUserDashboard() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("user", getUserProfileData(user));
            dashboard.put("recentApplications", 0); // Mock data - implement actual logic
            dashboard.put("upcomingInterviews", 0); // Mock data - implement actual logic
            dashboard.put("profileCompletion", 75); // Mock data - implement actual logic

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/notifications")
    public ResponseEntity<Map<String, Object>> getUserNotifications() {
        try {
            // Mock notifications - implement actual logic
            Map<String, Object> notifications = new HashMap<>();
            notifications.put("unread", 0);
            notifications.put("notifications", new Object[]{});

            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markNotificationRead(@PathVariable Long notificationId) {
        try {
            // Mock implementation - implement actual logic
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notification marked as read");
            response.put("notificationId", notificationId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Map<String, Object> getUserProfileData(User user) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole().name());
        profile.put("status", user.isStatus());
        return profile;
    }
}
