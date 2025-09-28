package com.example.job_platform.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final ConcurrentLinkedQueue<AuditEntry> auditLog = new ConcurrentLinkedQueue<>();
    private final int MAX_LOG_SIZE = 1000; // Keep last 1000 entries

    public void logUserAction(String userId, String action, String details) {
        AuditEntry entry = new AuditEntry(
                generateId(),
                "USER_ACTION",
                userId,
                action,
                details,
                LocalDateTime.now()
        );
        addAuditEntry(entry);
    }

    public void logSystemEvent(String eventType, String description) {
        AuditEntry entry = new AuditEntry(
                generateId(),
                "SYSTEM_EVENT",
                "SYSTEM",
                eventType,
                description,
                LocalDateTime.now()
        );
        addAuditEntry(entry);
    }

    public void logAuthenticationEvent(String userId, String action, boolean success) {
        String details = success ? "SUCCESS" : "FAILED";
        AuditEntry entry = new AuditEntry(
                generateId(),
                "AUTHENTICATION",
                userId,
                action,
                details,
                LocalDateTime.now()
        );
        addAuditEntry(entry);
    }

    public void logJobPostAction(String userId, String jobId, String action) {
        String details = "Job ID: " + jobId;
        AuditEntry entry = new AuditEntry(
                generateId(),
                "JOB_POST",
                userId,
                action,
                details,
                LocalDateTime.now()
        );
        addAuditEntry(entry);
    }

    public void logApplicationAction(String userId, String applicationId, String action) {
        String details = "Application ID: " + applicationId;
        AuditEntry entry = new AuditEntry(
                generateId(),
                "APPLICATION",
                userId,
                action,
                details,
                LocalDateTime.now()
        );
        addAuditEntry(entry);
    }

    public void logPaymentAction(String userId, String paymentId, String action, String amount) {
        String details = "Payment ID: " + paymentId + ", Amount: " + amount;
        AuditEntry entry = new AuditEntry(
                generateId(),
                "PAYMENT",
                userId,
                action,
                details,
                LocalDateTime.now()
        );
        addAuditEntry(entry);
    }

    public List<AuditEntry> getRecentAuditLogs(int limit) {
        List<AuditEntry> logs = new ArrayList<>(auditLog);

        // Sort by timestamp (newest first)
        logs.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

        // Return limited results
        return logs.stream().limit(limit).collect(Collectors.toList());
    }

    public List<AuditEntry> getAuditLogsByType(String type) {
        return auditLog.stream()
                .filter(entry -> entry.getType().equals(type))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }

    public List<AuditEntry> getAuditLogsByUser(String userId) {
        return auditLog.stream()
                .filter(entry -> entry.getUserId().equals(userId))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }

    public Map<String, Long> getAuditStatistics() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("totalEntries", (long) auditLog.size());
        stats.put("userActions", auditLog.stream().filter(e -> e.getType().equals("USER_ACTION")).count());
        stats.put("systemEvents", auditLog.stream().filter(e -> e.getType().equals("SYSTEM_EVENT")).count());
        stats.put("authEvents", auditLog.stream().filter(e -> e.getType().equals("AUTHENTICATION")).count());
        stats.put("jobPostEvents", auditLog.stream().filter(e -> e.getType().equals("JOB_POST")).count());
        stats.put("applicationEvents", auditLog.stream().filter(e -> e.getType().equals("APPLICATION")).count());
        stats.put("paymentEvents", auditLog.stream().filter(e -> e.getType().equals("PAYMENT")).count());

        return stats;
    }

    private void addAuditEntry(AuditEntry entry) {
        auditLog.offer(entry);

        // Maintain max size
        while (auditLog.size() > MAX_LOG_SIZE) {
            auditLog.poll();
        }
    }

    private String generateId() {
        return "AUDIT_" + System.currentTimeMillis() + "_" + Thread.currentThread().getId();
    }

    // Inner class for audit entries
    public static class AuditEntry {

        private final String id;
        private final String type;
        private final String userId;
        private final String action;
        private final String details;
        private final LocalDateTime timestamp;

        public AuditEntry(String id, String type, String userId, String action, String details, LocalDateTime timestamp) {
            this.id = id;
            this.type = type;
            this.userId = userId;
            this.action = action;
            this.details = details;
            this.timestamp = timestamp;
        }

        // Getters
        public String getId() {
            return id;
        }

        public String getType() {
            return type;
        }

        public String getUserId() {
            return userId;
        }

        public String getAction() {
            return action;
        }

        public String getDetails() {
            return details;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }
    }
}
