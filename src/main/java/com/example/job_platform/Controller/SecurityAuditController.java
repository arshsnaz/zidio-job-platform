package com.example.job_platform.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.Service.SecurityAuditService;
import com.example.job_platform.Service.SecurityAuditService.SecurityEvent;
import com.example.job_platform.Service.SecurityAuditService.SecurityEventType;

@RestController
@RequestMapping("/api/security")
public class SecurityAuditController {

    @Autowired
    private SecurityAuditService securityAuditService;

    @GetMapping("/events/recent")
    public ResponseEntity<List<SecurityEvent>> getRecentSecurityEvents(@RequestParam(defaultValue = "50") int limit) {
        try {
            List<SecurityEvent> events = securityAuditService.getRecentSecurityEvents(limit);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/events/type/{eventType}")
    public ResponseEntity<List<SecurityEvent>> getSecurityEventsByType(@PathVariable SecurityEventType eventType) {
        try {
            List<SecurityEvent> events = securityAuditService.getSecurityEventsByType(eventType);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/events/user/{email}")
    public ResponseEntity<List<SecurityEvent>> getSecurityEventsByUser(@PathVariable String email) {
        try {
            List<SecurityEvent> events = securityAuditService.getSecurityEventsByUser(email);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSecuritySummary() {
        try {
            Map<String, Object> summary = securityAuditService.getSecuritySummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/ip-addresses/top")
    public ResponseEntity<Map<String, Integer>> getTopIpAddresses(@RequestParam(defaultValue = "10") int limit) {
        try {
            Map<String, Integer> topIps = securityAuditService.getTopIpAddresses(limit);
            return ResponseEntity.ok(topIps);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/account-locked/{email}")
    public ResponseEntity<Boolean> isAccountLocked(@PathVariable String email) {
        try {
            boolean isLocked = securityAuditService.isAccountLocked(email);
            return ResponseEntity.ok(isLocked);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/unlock-account/{email}")
    public ResponseEntity<String> unlockAccount(@PathVariable String email,
            @RequestParam String adminEmail,
            @RequestParam String ipAddress) {
        try {
            securityAuditService.unlockAccount(email, adminEmail, ipAddress);
            return ResponseEntity.ok("Account unlocked successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to unlock account: " + e.getMessage());
        }
    }

    @PostMapping("/health-check")
    public ResponseEntity<String> performSecurityHealthCheck() {
        try {
            securityAuditService.performSecurityHealthCheck();
            return ResponseEntity.ok("Security health check completed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Security health check failed: " + e.getMessage());
        }
    }

    @GetMapping("/validate-access/{email}")
    public ResponseEntity<Boolean> validateUserAccess(@PathVariable String email,
            @RequestParam String resource) {
        try {
            boolean hasAccess = securityAuditService.validateUserAccess(email, resource);
            return ResponseEntity.ok(hasAccess);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
