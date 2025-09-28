package com.example.job_platform.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.Service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getSystemOverview() {
        return ResponseEntity.ok(dashboardService.getSystemOverview());
    }

    @GetMapping("/users/growth")
    public ResponseEntity<Map<String, Object>> getUserGrowthStats() {
        return ResponseEntity.ok(dashboardService.getUserGrowthStats());
    }

    @GetMapping("/jobs/market")
    public ResponseEntity<Map<String, Object>> getJobMarketStats() {
        return ResponseEntity.ok(dashboardService.getJobMarketStats());
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        return ResponseEntity.ok(dashboardService.getRevenueStats());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(dashboardService.getSystemHealth());
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllDashboardData() {
        Map<String, Object> allData = dashboardService.getSystemOverview();
        allData.put("userGrowth", dashboardService.getUserGrowthStats());
        allData.put("jobMarket", dashboardService.getJobMarketStats());
        allData.put("revenue", dashboardService.getRevenueStats());
        allData.put("systemHealth", dashboardService.getSystemHealth());

        return ResponseEntity.ok(allData);
    }
}
