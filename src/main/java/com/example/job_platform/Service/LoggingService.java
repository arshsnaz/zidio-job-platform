package com.example.job_platform.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class LoggingService {

    public enum LogLevel {
        DEBUG, INFO, WARN, ERROR, CRITICAL
    }

    private final Map<LogLevel, AtomicLong> logCounts = new ConcurrentHashMap<>();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    public LoggingService() {
        // Initialize counters
        for (LogLevel level : LogLevel.values()) {
            logCounts.put(level, new AtomicLong(0));
        }
    }

    public void debug(String message) {
        log(LogLevel.DEBUG, message, null, null);
    }

    public void debug(String message, Map<String, Object> context) {
        log(LogLevel.DEBUG, message, null, context);
    }

    public void info(String message) {
        log(LogLevel.INFO, message, null, null);
    }

    public void info(String message, Map<String, Object> context) {
        log(LogLevel.INFO, message, null, context);
    }

    public void warn(String message) {
        log(LogLevel.WARN, message, null, null);
    }

    public void warn(String message, Exception exception) {
        log(LogLevel.WARN, message, exception, null);
    }

    public void warn(String message, Map<String, Object> context) {
        log(LogLevel.WARN, message, null, context);
    }

    public void error(String message) {
        log(LogLevel.ERROR, message, null, null);
    }

    public void error(String message, Exception exception) {
        log(LogLevel.ERROR, message, exception, null);
    }

    public void error(String message, Exception exception, Map<String, Object> context) {
        log(LogLevel.ERROR, message, exception, context);
    }

    public void critical(String message) {
        log(LogLevel.CRITICAL, message, null, null);
    }

    public void critical(String message, Exception exception) {
        log(LogLevel.CRITICAL, message, exception, null);
    }

    public void critical(String message, Exception exception, Map<String, Object> context) {
        log(LogLevel.CRITICAL, message, exception, context);
    }

    private void log(LogLevel level, String message, Exception exception, Map<String, Object> context) {
        try {
            // Increment counter
            logCounts.get(level).incrementAndGet();

            // Build log entry
            StringBuilder logEntry = new StringBuilder();
            logEntry.append("[").append(level.name()).append("] ");
            logEntry.append(LocalDateTime.now().format(formatter)).append(" - ");
            logEntry.append(message);

            // Add context if provided
            if (context != null && !context.isEmpty()) {
                logEntry.append(" | Context: ").append(formatContext(context));
            }

            // Add exception details if provided
            if (exception != null) {
                logEntry.append(" | Exception: ").append(exception.getClass().getSimpleName());
                logEntry.append(" - ").append(exception.getMessage());
            }

            // Output to console (in production, this would go to a proper logging framework)
            System.out.println(logEntry.toString());

            // Print stack trace for ERROR and CRITICAL levels
            if ((level == LogLevel.ERROR || level == LogLevel.CRITICAL) && exception != null) {
                exception.printStackTrace();
            }

        } catch (Exception loggingException) {
            // Prevent logging failures from breaking the application
            System.err.println("Logging failed: " + loggingException.getMessage());
        }
    }

    private String formatContext(Map<String, Object> context) {
        StringBuilder contextString = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : context.entrySet()) {
            if (!first) {
                contextString.append(", ");
            }
            contextString.append(entry.getKey()).append("=").append(entry.getValue());
            first = false;
        }
        contextString.append("}");
        return contextString.toString();
    }

    public void logUserAction(String userEmail, String action, String details) {
        Map<String, Object> context = new ConcurrentHashMap<>();
        context.put("user", userEmail);
        context.put("action", action);
        context.put("details", details);
        info("User action performed", context);
    }

    public void logSystemEvent(String event, String details) {
        Map<String, Object> context = new ConcurrentHashMap<>();
        context.put("eventType", "SYSTEM");
        context.put("event", event);
        context.put("details", details);
        info("System event", context);
    }

    public void logPerformanceMetric(String operation, long executionTimeMs, boolean success) {
        Map<String, Object> context = new ConcurrentHashMap<>();
        context.put("operation", operation);
        context.put("executionTimeMs", executionTimeMs);
        context.put("success", success);
        
        LogLevel level = success ? LogLevel.INFO : LogLevel.WARN;
        if (executionTimeMs > 5000) { // Slow operation
            level = LogLevel.WARN;
        }
        
        log(level, "Performance metric", null, context);
    }

    public void logSecurityEvent(String eventType, String userEmail, String ipAddress, String details) {
        Map<String, Object> context = new ConcurrentHashMap<>();
        context.put("eventType", eventType);
        context.put("user", userEmail);
        context.put("ipAddress", ipAddress);
        context.put("details", details);
        
        LogLevel level = eventType.contains("FAILURE") || eventType.contains("LOCKED") ? LogLevel.WARN : LogLevel.INFO;
        if (eventType.contains("SUSPICIOUS") || eventType.contains("UNAUTHORIZED")) {
            level = LogLevel.ERROR;
        }
        
        log(level, "Security event", null, context);
    }

    public Map<LogLevel, Long> getLogStatistics() {
        Map<LogLevel, Long> stats = new ConcurrentHashMap<>();
        for (Map.Entry<LogLevel, AtomicLong> entry : logCounts.entrySet()) {
            stats.put(entry.getKey(), entry.getValue().get());
        }
        return stats;
    }

    public void resetStatistics() {
        for (AtomicLong counter : logCounts.values()) {
            counter.set(0);
        }
        info("Log statistics reset");
    }

    // Health check for logging service
    public boolean isHealthy() {
        try {
            debug("Health check test log");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}