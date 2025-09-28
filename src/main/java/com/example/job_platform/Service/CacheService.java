package com.example.job_platform.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.JobPostDTO;
import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Repository.JobPostRepository;

@Service
public class CacheService {

    private final Map<String, Object> cache = new ConcurrentHashMap<>();
    private final Map<String, Long> cacheTimestamps = new ConcurrentHashMap<>();
    private final long DEFAULT_TTL = 300000; // 5 minutes in milliseconds
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Autowired
    private JobPostRepository jobPostRepository;

    public CacheService() {
        // Schedule cache cleanup every 5 minutes
        scheduler.scheduleAtFixedRate(this::cleanupExpiredEntries, 5, 5, TimeUnit.MINUTES);
    }

    public void put(String key, Object value) {
        put(key, value, DEFAULT_TTL);
    }

    public void put(String key, Object value, long ttlMs) {
        cache.put(key, value);
        cacheTimestamps.put(key, System.currentTimeMillis() + ttlMs);
    }

    @SuppressWarnings("unchecked")
    public <T> T get(String key, Class<T> clazz) {
        if (!isValid(key)) {
            remove(key);
            return null;
        }

        Object value = cache.get(key);
        if (value != null && clazz.isInstance(value)) {
            return (T) value;
        }
        return null;
    }

    public Object get(String key) {
        if (!isValid(key)) {
            remove(key);
            return null;
        }
        return cache.get(key);
    }

    public boolean containsKey(String key) {
        return isValid(key) && cache.containsKey(key);
    }

    public void remove(String key) {
        cache.remove(key);
        cacheTimestamps.remove(key);
    }

    public void clear() {
        cache.clear();
        cacheTimestamps.clear();
    }

    public int size() {
        cleanupExpiredEntries();
        return cache.size();
    }

    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("cacheSize", cache.size());
        stats.put("totalEntries", cacheTimestamps.size());
        stats.put("memoryUsage", getApproximateMemoryUsage());
        return stats;
    }

    // Cached methods for frequently accessed data
    @SuppressWarnings("unchecked")
    public List<JobPostDTO> getCachedRecentJobs(int limit) {
        String key = "recent_jobs_" + limit;
        List<JobPostDTO> cached = get(key, List.class);

        if (cached == null) {
            // Cache miss - fetch from database
            cached = jobPostRepository.findAll().stream()
                    .sorted((a, b) -> {
                        if (a.getCreatedAt() == null && b.getCreatedAt() == null) {
                            return 0;
                        }
                        if (a.getCreatedAt() == null) {
                            return 1;
                        }
                        if (b.getCreatedAt() == null) {
                            return -1;
                        }
                        return b.getCreatedAt().compareTo(a.getCreatedAt());
                    })
                    .limit(limit)
                    .map(this::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());

            put(key, cached, 600000); // Cache for 10 minutes
        }

        return cached;
    }

    @SuppressWarnings("unchecked")
    public List<JobPostDTO> getCachedJobsByLocation(String location) {
        String key = "jobs_location_" + location.toLowerCase();
        List<JobPostDTO> cached = get(key, List.class);

        if (cached == null) {
            cached = jobPostRepository.findAll().stream()
                    .filter(job -> job.getLocation() != null
                    && job.getLocation().toLowerCase().contains(location.toLowerCase()))
                    .map(this::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());

            put(key, cached, 900000); // Cache for 15 minutes
        }

        return cached;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Long> getCachedJobStatistics() {
        String key = "job_statistics";
        Map<String, Long> cached = get(key, Map.class);

        if (cached == null) {
            List<JobPost> allJobs = jobPostRepository.findAll();
            cached = new HashMap<>();

            // Calculate statistics
            cached.put("totalJobs", (long) allJobs.size());
            cached.put("internshipJobs", allJobs.stream()
                    .filter(job -> job.getType() != null
                    && job.getType().toLowerCase().contains("internship"))
                    .count());
            cached.put("fullTimeJobs", allJobs.stream()
                    .filter(job -> job.getType() != null
                    && job.getType().toLowerCase().contains("full"))
                    .count());

            put(key, cached, 1800000); // Cache for 30 minutes
        }

        return cached;
    }

    public void invalidateJobCaches() {
        // Remove all job-related cache entries
        cache.entrySet().removeIf(entry
                -> entry.getKey().startsWith("recent_jobs_")
                || entry.getKey().startsWith("jobs_location_")
                || entry.getKey().equals("job_statistics"));

        cacheTimestamps.entrySet().removeIf(entry
                -> entry.getKey().startsWith("recent_jobs_")
                || entry.getKey().startsWith("jobs_location_")
                || entry.getKey().equals("job_statistics"));
    }

    public void invalidateUserCaches(Long userId) {
        String userPrefix = "user_" + userId + "_";
        cache.entrySet().removeIf(entry -> entry.getKey().startsWith(userPrefix));
        cacheTimestamps.entrySet().removeIf(entry -> entry.getKey().startsWith(userPrefix));
    }

    public void preloadCommonData() {
        try {
            // Preload frequently accessed data
            getCachedRecentJobs(10);
            getCachedRecentJobs(20);
            getCachedJobStatistics();

            // Preload popular locations (if we had that data)
            // This is just an example - you'd want to identify actual popular locations
            String[] popularLocations = {"Remote", "New York", "San Francisco", "London", "Bangalore"};
            for (String location : popularLocations) {
                getCachedJobsByLocation(location);
            }
        } catch (Exception e) {
            System.err.println("Error preloading cache data: " + e.getMessage());
        }
    }

    private boolean isValid(String key) {
        Long expiry = cacheTimestamps.get(key);
        return expiry != null && System.currentTimeMillis() < expiry;
    }

    private void cleanupExpiredEntries() {
        long now = System.currentTimeMillis();
        cacheTimestamps.entrySet().removeIf(entry -> {
            if (now >= entry.getValue()) {
                cache.remove(entry.getKey());
                return true;
            }
            return false;
        });
    }

    private long getApproximateMemoryUsage() {
        // Simple approximation - in real applications you'd use more sophisticated memory measurement
        return cache.size() * 1024; // Assume 1KB per entry average
    }

    private JobPostDTO convertToDTO(JobPost job) {
        JobPostDTO dto = new JobPostDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setStipend(job.getStipend());
        dto.setType(job.getType());
        dto.setLocation(job.getLocation());
        dto.setCreatedAt(job.getCreatedAt());

        if (job.getRecruiter() != null) {
            dto.setCompanyName(job.getRecruiter().getCompanyName());
            if (job.getRecruiter().getUser() != null) {
                dto.setRecruiterEmail(job.getRecruiter().getUser().getEmail());
            }
        }

        return dto;
    }

    // Cleanup when service is destroyed
    public void destroy() {
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
