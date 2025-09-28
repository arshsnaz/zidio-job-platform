package com.example.job_platform.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class PerformanceMonitoringService {

    private final Map<String, AtomicLong> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, AtomicLong> totalExecutionTimeMap = new ConcurrentHashMap<>();
    private final Map<String, AtomicLong> errorCounts = new ConcurrentHashMap<>();
    private final List<PerformanceMetric> recentMetrics = new ArrayList<>();

    private static final int MAX_METRICS_HISTORY = 1000;

    public static class PerformanceMetric {

        private final LocalDateTime timestamp;
        private final String operation;
        private final long executionTimeMs;
        private final boolean success;
        private final String errorMessage;
        private final String additionalInfo;

        public PerformanceMetric(String operation, long executionTimeMs, boolean success, String errorMessage, String additionalInfo) {
            this.timestamp = LocalDateTime.now();
            this.operation = operation;
            this.executionTimeMs = executionTimeMs;
            this.success = success;
            this.errorMessage = errorMessage;
            this.additionalInfo = additionalInfo;
        }

        // Getters
        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public String getOperation() {
            return operation;
        }

        public long getExecutionTimeMs() {
            return executionTimeMs;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public String getAdditionalInfo() {
            return additionalInfo;
        }
    }

    public void recordOperation(String operation, long executionTimeMs, boolean success, String errorMessage) {
        recordOperation(operation, executionTimeMs, success, errorMessage, null);
    }

    public void recordOperation(String operation, long executionTimeMs, boolean success, String errorMessage, String additionalInfo) {
        // Update counters
        requestCounts.computeIfAbsent(operation, k -> new AtomicLong(0)).incrementAndGet();
        totalExecutionTimeMap.computeIfAbsent(operation, k -> new AtomicLong(0)).addAndGet(executionTimeMs);

        if (!success) {
            errorCounts.computeIfAbsent(operation, k -> new AtomicLong(0)).incrementAndGet();
        }

        // Add to recent metrics
        PerformanceMetric metric = new PerformanceMetric(operation, executionTimeMs, success, errorMessage, additionalInfo);
        synchronized (recentMetrics) {
            recentMetrics.add(metric);

            // Keep only recent metrics to prevent memory issues
            if (recentMetrics.size() > MAX_METRICS_HISTORY) {
                recentMetrics.remove(0);
            }
        }

        // Log performance issues
        if (executionTimeMs > 5000) { // More than 5 seconds
            System.out.printf("[PERFORMANCE] SLOW OPERATION: %s took %d ms at %s%n",
                    operation, executionTimeMs, LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        if (!success) {
            System.out.printf("[PERFORMANCE] OPERATION FAILED: %s failed with error: %s%n", operation, errorMessage);
        }
    }

    public Map<String, Object> getOperationStatistics(String operation) {
        Map<String, Object> stats = new HashMap<>();

        AtomicLong count = requestCounts.get(operation);
        AtomicLong totalTime = totalExecutionTimeMap.get(operation);
        AtomicLong errors = errorCounts.get(operation);

        long requestCount = count != null ? count.get() : 0;
        long totalExecutionMs = totalTime != null ? totalTime.get() : 0;
        long errorCount = errors != null ? errors.get() : 0;

        stats.put("operation", operation);
        stats.put("totalRequests", requestCount);
        stats.put("totalExecutionTimeMs", totalExecutionMs);
        stats.put("averageExecutionTimeMs", requestCount > 0 ? totalExecutionMs / requestCount : 0);
        stats.put("errorCount", errorCount);
        stats.put("successRate", requestCount > 0 ? ((double) (requestCount - errorCount) / requestCount) * 100 : 0);

        return stats;
    }

    public Map<String, Object> getSystemPerformanceOverview() {
        Map<String, Object> overview = new HashMap<>();

        // Overall statistics
        long totalRequests = requestCounts.values().stream().mapToLong(AtomicLong::get).sum();
        long totalErrors = errorCounts.values().stream().mapToLong(AtomicLong::get).sum();
        long totalExecutionTime = this.totalExecutionTimeMap.values().stream().mapToLong(AtomicLong::get).sum();

        overview.put("totalRequests", totalRequests);
        overview.put("totalErrors", totalErrors);
        overview.put("overallSuccessRate", totalRequests > 0 ? ((double) (totalRequests - totalErrors) / totalRequests) * 100 : 0);
        overview.put("averageExecutionTimeMs", totalRequests > 0 ? totalExecutionTime / totalRequests : 0);

        // Top operations by request count
        List<Map<String, Object>> topOperations = requestCounts.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue().get(), a.getValue().get()))
                .limit(10)
                .map(entry -> {
                    Map<String, Object> opStats = getOperationStatistics(entry.getKey());
                    return opStats;
                })
                .collect(java.util.stream.Collectors.toList());

        overview.put("topOperations", topOperations);

        // Slowest operations
        List<Map<String, Object>> slowestOperations = requestCounts.entrySet().stream()
                .filter(entry -> entry.getValue().get() > 0)
                .map(entry -> {
                    String operation = entry.getKey();
                    AtomicLong totalTimeAtomic = totalExecutionTimeMap.get(operation);
                    long totalTime = totalTimeAtomic != null ? totalTimeAtomic.get() : 0;
                    long count = entry.getValue().get();
                    long avgTime = count > 0 ? totalTime / count : 0;

                    Map<String, Object> opData = new HashMap<>();
                    opData.put("operation", operation);
                    opData.put("averageTimeMs", avgTime);
                    opData.put("totalRequests", count);
                    return opData;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("averageTimeMs"), (Long) a.get("averageTimeMs")))
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        overview.put("slowestOperations", slowestOperations);

        // Recent errors
        List<PerformanceMetric> recentErrors = getRecentMetrics(50).stream()
                .filter(metric -> !metric.isSuccess())
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        overview.put("recentErrors", recentErrors);

        return overview;
    }

    public List<PerformanceMetric> getRecentMetrics(int limit) {
        synchronized (recentMetrics) {
            return recentMetrics.stream()
                    .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                    .limit(limit)
                    .collect(java.util.stream.Collectors.toList());
        }
    }

    public List<PerformanceMetric> getMetricsByOperation(String operation, int limit) {
        synchronized (recentMetrics) {
            return recentMetrics.stream()
                    .filter(metric -> operation.equals(metric.getOperation()))
                    .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                    .limit(limit)
                    .collect(java.util.stream.Collectors.toList());
        }
    }

    public List<PerformanceMetric> getSlowOperations(long thresholdMs, int limit) {
        synchronized (recentMetrics) {
            return recentMetrics.stream()
                    .filter(metric -> metric.getExecutionTimeMs() > thresholdMs)
                    .sorted((a, b) -> Long.compare(b.getExecutionTimeMs(), a.getExecutionTimeMs()))
                    .limit(limit)
                    .collect(java.util.stream.Collectors.toList());
        }
    }

    public Map<String, Object> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();

        // System performance indicators
        long totalRequests = requestCounts.values().stream().mapToLong(AtomicLong::get).sum();
        long totalErrors = errorCounts.values().stream().mapToLong(AtomicLong::get).sum();

        double errorRate = totalRequests > 0 ? ((double) totalErrors / totalRequests) * 100 : 0;

        // Determine health status
        String status;
        if (errorRate > 10) {
            status = "UNHEALTHY";
        } else if (errorRate > 5) {
            status = "DEGRADED";
        } else {
            status = "HEALTHY";
        }

        health.put("status", status);
        health.put("totalRequests", totalRequests);
        health.put("errorRate", errorRate);
        health.put("timestamp", LocalDateTime.now());

        // Check for recent performance issues
        List<PerformanceMetric> recentSlowOps = getSlowOperations(3000, 5); // Operations taking more than 3 seconds
        health.put("recentSlowOperations", recentSlowOps.size());

        return health;
    }

    public void resetStatistics() {
        requestCounts.clear();
        totalExecutionTimeMap.clear();
        errorCounts.clear();
        synchronized (recentMetrics) {
            recentMetrics.clear();
        }
        System.out.println("[PERFORMANCE] Statistics reset at " + LocalDateTime.now());
    }

    public void resetStatisticsForOperation(String operation) {
        requestCounts.remove(operation);
        totalExecutionTimeMap.remove(operation);
        errorCounts.remove(operation);

        synchronized (recentMetrics) {
            recentMetrics.removeIf(metric -> operation.equals(metric.getOperation()));
        }

        System.out.println("[PERFORMANCE] Statistics reset for operation: " + operation);
    }

    // Utility method to measure execution time of operations
    public <T> T measureOperation(String operationName, java.util.function.Supplier<T> operation) {
        long startTime = System.currentTimeMillis();
        boolean success = false;
        String errorMessage = null;
        T result = null;

        try {
            result = operation.get();
            success = true;
            return result;
        } catch (Exception e) {
            errorMessage = e.getMessage();
            throw e;
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;
            recordOperation(operationName, executionTime, success, errorMessage);
        }
    }

    public void measureOperation(String operationName, Runnable operation) {
        long startTime = System.currentTimeMillis();
        boolean success = false;
        String errorMessage = null;

        try {
            operation.run();
            success = true;
        } catch (Exception e) {
            errorMessage = e.getMessage();
            throw e;
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;
            recordOperation(operationName, executionTime, success, errorMessage);
        }
    }
}
