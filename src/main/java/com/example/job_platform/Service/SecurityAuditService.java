package com.example.job_platform.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.Entity.User;
import com.example.job_platform.Repository.UserRepository;

@Service
public class SecurityAuditService {

    @Autowired
    private UserRepository userRepository;

    // Track login attempts
    private final Map<String, AtomicInteger> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lastFailedLogin = new ConcurrentHashMap<>();
    private final List<SecurityEvent> securityEvents = new ArrayList<>();
    private final Map<String, AtomicInteger> ipAccessCount = new ConcurrentHashMap<>();

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 30;

    public enum SecurityEventType {
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        ACCOUNT_LOCKED,
        SUSPICIOUS_ACTIVITY,
        PASSWORD_CHANGED,
        ACCOUNT_CREATED,
        UNAUTHORIZED_ACCESS_ATTEMPT,
        DATA_EXPORT,
        ADMIN_ACTION
    }

    public static class SecurityEvent {

        private final LocalDateTime timestamp;
        private final SecurityEventType eventType;
        private final String userEmail;
        private final String ipAddress;
        private final String details;
        private final String severity;

        public SecurityEvent(SecurityEventType eventType, String userEmail, String ipAddress, String details, String severity) {
            this.timestamp = LocalDateTime.now();
            this.eventType = eventType;
            this.userEmail = userEmail;
            this.ipAddress = ipAddress;
            this.details = details;
            this.severity = severity;
        }

        // Getters
        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public SecurityEventType getEventType() {
            return eventType;
        }

        public String getUserEmail() {
            return userEmail;
        }

        public String getIpAddress() {
            return ipAddress;
        }

        public String getDetails() {
            return details;
        }

        public String getSeverity() {
            return severity;
        }
    }

    public void logSecurityEvent(SecurityEventType eventType, String userEmail, String ipAddress, String details) {
        String severity = determineSeverity(eventType);
        SecurityEvent event = new SecurityEvent(eventType, userEmail, ipAddress, details, severity);
        securityEvents.add(event);

        // Keep only last 1000 events to prevent memory issues
        if (securityEvents.size() > 1000) {
            securityEvents.remove(0);
        }

        // Log to console for immediate visibility
        System.out.printf("[SECURITY] %s - %s: %s from %s - %s%n",
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                severity, eventType, ipAddress, details);
    }

    public boolean isAccountLocked(String email) {
        AtomicInteger attempts = loginAttempts.get(email);
        LocalDateTime lastFailed = lastFailedLogin.get(email);

        if (attempts != null && attempts.get() >= MAX_LOGIN_ATTEMPTS && lastFailed != null) {
            return lastFailed.plusMinutes(LOCKOUT_DURATION_MINUTES).isAfter(LocalDateTime.now());
        }
        return false;
    }

    public void recordLoginAttempt(String email, String ipAddress, boolean success) {
        if (success) {
            loginAttempts.remove(email);
            lastFailedLogin.remove(email);
            logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, email, ipAddress, "Successful login");
        } else {
            AtomicInteger attempts = loginAttempts.computeIfAbsent(email, k -> new AtomicInteger(0));
            int currentAttempts = attempts.incrementAndGet();
            lastFailedLogin.put(email, LocalDateTime.now());

            logSecurityEvent(SecurityEventType.LOGIN_FAILURE, email, ipAddress,
                    "Failed login attempt #" + currentAttempts);

            if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
                logSecurityEvent(SecurityEventType.ACCOUNT_LOCKED, email, ipAddress,
                        "Account locked due to " + MAX_LOGIN_ATTEMPTS + " failed attempts");
            }
        }

        // Track IP access patterns
        ipAccessCount.computeIfAbsent(ipAddress, k -> new AtomicInteger(0)).incrementAndGet();
    }

    public void recordPasswordChange(String email, String ipAddress) {
        logSecurityEvent(SecurityEventType.PASSWORD_CHANGED, email, ipAddress, "Password changed successfully");
    }

    public void recordAccountCreation(String email, String ipAddress) {
        logSecurityEvent(SecurityEventType.ACCOUNT_CREATED, email, ipAddress, "New account created");
    }

    public void recordUnauthorizedAccess(String email, String ipAddress, String resource) {
        logSecurityEvent(SecurityEventType.UNAUTHORIZED_ACCESS_ATTEMPT, email, ipAddress,
                "Attempted to access unauthorized resource: " + resource);
    }

    public void recordDataExport(String email, String ipAddress, String dataType) {
        logSecurityEvent(SecurityEventType.DATA_EXPORT, email, ipAddress,
                "Data export performed: " + dataType);
    }

    public void recordAdminAction(String adminEmail, String ipAddress, String action, String targetUser) {
        logSecurityEvent(SecurityEventType.ADMIN_ACTION, adminEmail, ipAddress,
                String.format("Admin action '%s' performed on user: %s", action, targetUser));
    }

    public void detectSuspiciousActivity(String email, String ipAddress) {
        // Check for suspicious patterns
        AtomicInteger ipCount = ipAccessCount.get(ipAddress);
        if (ipCount != null && ipCount.get() > 100) { // More than 100 requests from same IP
            logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, email, ipAddress,
                    "High number of requests from single IP: " + ipCount.get());
        }

        // Check for multiple failed logins
        AtomicInteger attempts = loginAttempts.get(email);
        if (attempts != null && attempts.get() > 3) {
            logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, email, ipAddress,
                    "Multiple failed login attempts detected");
        }
    }

    public List<SecurityEvent> getRecentSecurityEvents(int limit) {
        return securityEvents.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<SecurityEvent> getSecurityEventsByType(SecurityEventType eventType) {
        return securityEvents.stream()
                .filter(event -> event.getEventType() == eventType)
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<SecurityEvent> getSecurityEventsByUser(String email) {
        return securityEvents.stream()
                .filter(event -> email.equals(event.getUserEmail()))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(java.util.stream.Collectors.toList());
    }

    public Map<String, Object> getSecuritySummary() {
        Map<String, Object> summary = new HashMap<>();

        // Count events by type
        Map<SecurityEventType, Long> eventCounts = securityEvents.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        SecurityEvent::getEventType,
                        java.util.stream.Collectors.counting()));

        // Count locked accounts
        long lockedAccounts = loginAttempts.entrySet().stream()
                .filter(entry -> entry.getValue().get() >= MAX_LOGIN_ATTEMPTS)
                .count();

        // Recent high-severity events
        List<SecurityEvent> recentCritical = securityEvents.stream()
                .filter(event -> "HIGH".equals(event.getSeverity()) || "CRITICAL".equals(event.getSeverity()))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        summary.put("eventCounts", eventCounts);
        summary.put("lockedAccounts", lockedAccounts);
        summary.put("totalEvents", securityEvents.size());
        summary.put("recentCriticalEvents", recentCritical);
        summary.put("topIpAddresses", getTopIpAddresses(10));

        return summary;
    }

    public Map<String, Integer> getTopIpAddresses(int limit) {
        return ipAccessCount.entrySet().stream()
                .sorted((a, b) -> b.getValue().get() - a.getValue().get())
                .limit(limit)
                .collect(java.util.stream.Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().get(),
                        (e1, e2) -> e1,
                        java.util.LinkedHashMap::new));
    }

    public void unlockAccount(String email, String adminEmail, String ipAddress) {
        loginAttempts.remove(email);
        lastFailedLogin.remove(email);
        recordAdminAction(adminEmail, ipAddress, "UNLOCK_ACCOUNT", email);
    }

    public boolean validateUserAccess(String email, String requestedResource) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return false;
            }

            // Basic access validation - can be enhanced with role-based access control
            if (!user.isStatus()) { // Account is disabled
                return false;
            }

            // Add more sophisticated access control logic here
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void performSecurityHealthCheck() {
        try {
            // Check for accounts with too many failed attempts
            long lockedAccountsCount = loginAttempts.entrySet().stream()
                    .filter(entry -> entry.getValue().get() >= MAX_LOGIN_ATTEMPTS)
                    .count();

            if (lockedAccountsCount > 10) {
                logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, "SYSTEM", "localhost",
                        "High number of locked accounts detected: " + lockedAccountsCount);
            }

            // Check for unusual IP activity
            long suspiciousIps = ipAccessCount.entrySet().stream()
                    .filter(entry -> entry.getValue().get() > 1000)
                    .count();

            if (suspiciousIps > 0) {
                logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, "SYSTEM", "localhost",
                        "Detected " + suspiciousIps + " IPs with high activity");
            }

        } catch (Exception e) {
            logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, "SYSTEM", "localhost",
                    "Error during security health check: " + e.getMessage());
        }
    }

    private String determineSeverity(SecurityEventType eventType) {
        switch (eventType) {
            case LOGIN_SUCCESS:
            case ACCOUNT_CREATED:
                return "LOW";
            case LOGIN_FAILURE:
            case PASSWORD_CHANGED:
                return "MEDIUM";
            case ACCOUNT_LOCKED:
            case UNAUTHORIZED_ACCESS_ATTEMPT:
            case SUSPICIOUS_ACTIVITY:
                return "HIGH";
            case DATA_EXPORT:
            case ADMIN_ACTION:
                return "CRITICAL";
            default:
                return "MEDIUM";
        }
    }
}
