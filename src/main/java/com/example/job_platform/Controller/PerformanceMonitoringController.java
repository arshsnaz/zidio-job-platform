package com.example.job_platform.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.Service.PerformanceMonitoringService;
import com.example.job_platform.Service.PerformanceMonitoringService.PerformanceMetric;

@RestController
@RequestMapping("/api/performance")
public class PerformanceMonitoringController {

    @Autowired
    private PerformanceMonitoringService performanceMonitoringService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getSystemPerformanceOverview() {
        try {
            Map<String, Object> overview = performanceMonitoringService.getSystemPerformanceOverview();
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/operation/{operation}")
    public ResponseEntity<Map<String, Object>> getOperationStatistics(@PathVariable String operation) {
        try {
            Map<String, Object> stats = performanceMonitoringService.getOperationStatistics(operation);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/metrics/recent")
    public ResponseEntity<List<PerformanceMetric>> getRecentMetrics(@RequestParam(defaultValue = "100") int limit) {
        try {
            List<PerformanceMetric> metrics = performanceMonitoringService.getRecentMetrics(limit);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/metrics/operation/{operation}")
    public ResponseEntity<List<PerformanceMetric>> getMetricsByOperation(@PathVariable String operation,
            @RequestParam(defaultValue = "50") int limit) {
        try {
            List<PerformanceMetric> metrics = performanceMonitoringService.getMetricsByOperation(operation, limit);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/metrics/slow")
    public ResponseEntity<List<PerformanceMetric>> getSlowOperations(@RequestParam(defaultValue = "3000") long thresholdMs,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<PerformanceMetric> slowOps = performanceMonitoringService.getSlowOperations(thresholdMs, limit);
            return ResponseEntity.ok(slowOps);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        try {
            Map<String, Object> health = performanceMonitoringService.getHealthStatus();
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/reset")
    public ResponseEntity<String> resetStatistics() {
        try {
            performanceMonitoringService.resetStatistics();
            return ResponseEntity.ok("Performance statistics reset successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to reset statistics: " + e.getMessage());
        }
    }

    @DeleteMapping("/reset/operation/{operation}")
    public ResponseEntity<String> resetStatisticsForOperation(@PathVariable String operation) {
        try {
            performanceMonitoringService.resetStatisticsForOperation(operation);
            return ResponseEntity.ok("Statistics reset for operation: " + operation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to reset statistics: " + e.getMessage());
        }
    }
}
