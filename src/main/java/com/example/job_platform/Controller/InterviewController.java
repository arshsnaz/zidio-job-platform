package com.example.job_platform.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.Service.InterviewSchedulingService;
import com.example.job_platform.Service.InterviewSchedulingService.Interview;
import com.example.job_platform.Service.InterviewSchedulingService.InterviewStatus;
import com.example.job_platform.Service.InterviewSchedulingService.InterviewType;
import com.example.job_platform.Service.LoggingService;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewSchedulingService interviewSchedulingService;

    @Autowired
    private LoggingService loggingService;

    public static class ScheduleInterviewRequest {

        private Long applicationId;
        private InterviewType type;
        private LocalDateTime scheduledTime;
        private LocalDateTime endTime;
        private String interviewerEmail;
        private String interviewerName;
        private String location;
        private String meetingLink;

        // Default constructor
        public ScheduleInterviewRequest() {
        }

        // Getters and setters
        public Long getApplicationId() {
            return applicationId;
        }

        public void setApplicationId(Long applicationId) {
            this.applicationId = applicationId;
        }

        public InterviewType getType() {
            return type;
        }

        public void setType(InterviewType type) {
            this.type = type;
        }

        public LocalDateTime getScheduledTime() {
            return scheduledTime;
        }

        public void setScheduledTime(LocalDateTime scheduledTime) {
            this.scheduledTime = scheduledTime;
        }

        public LocalDateTime getEndTime() {
            return endTime;
        }

        public void setEndTime(LocalDateTime endTime) {
            this.endTime = endTime;
        }

        public String getInterviewerEmail() {
            return interviewerEmail;
        }

        public void setInterviewerEmail(String interviewerEmail) {
            this.interviewerEmail = interviewerEmail;
        }

        public String getInterviewerName() {
            return interviewerName;
        }

        public void setInterviewerName(String interviewerName) {
            this.interviewerName = interviewerName;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getMeetingLink() {
            return meetingLink;
        }

        public void setMeetingLink(String meetingLink) {
            this.meetingLink = meetingLink;
        }
    }

    public static class RescheduleInterviewRequest {

        private LocalDateTime newScheduledTime;
        private LocalDateTime newEndTime;
        private String reason;

        // Default constructor
        public RescheduleInterviewRequest() {
        }

        // Getters and setters
        public LocalDateTime getNewScheduledTime() {
            return newScheduledTime;
        }

        public void setNewScheduledTime(LocalDateTime newScheduledTime) {
            this.newScheduledTime = newScheduledTime;
        }

        public LocalDateTime getNewEndTime() {
            return newEndTime;
        }

        public void setNewEndTime(LocalDateTime newEndTime) {
            this.newEndTime = newEndTime;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    public static class CompleteInterviewRequest {

        private Integer score;
        private String feedback;

        // Default constructor
        public CompleteInterviewRequest() {
        }

        // Getters and setters
        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }

        public String getFeedback() {
            return feedback;
        }

        public void setFeedback(String feedback) {
            this.feedback = feedback;
        }
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<Map<String, Object>> scheduleInterview(@RequestBody ScheduleInterviewRequest request) {
        try {
            Interview interview = interviewSchedulingService.scheduleInterview(
                    request.getApplicationId(),
                    request.getType(),
                    request.getScheduledTime(),
                    request.getEndTime(),
                    request.getInterviewerEmail(),
                    request.getInterviewerName(),
                    request.getLocation(),
                    request.getMeetingLink()
            );

            loggingService.logUserAction("API_USER", "INTERVIEW_SCHEDULED",
                    String.format("Scheduled %s interview for application %d on %s",
                            request.getType(), request.getApplicationId(),
                            request.getScheduledTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Interview scheduled successfully");
            response.put("interviewId", interview.getId());
            response.put("interview", createInterviewResponse(interview));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            loggingService.error("Failed to schedule interview via API", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to schedule interview: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{interviewId}/reschedule")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<Map<String, Object>> rescheduleInterview(@PathVariable Long interviewId,
            @RequestBody RescheduleInterviewRequest request) {
        try {
            Interview interview = interviewSchedulingService.rescheduleInterview(
                    interviewId,
                    request.getNewScheduledTime(),
                    request.getNewEndTime(),
                    request.getReason()
            );

            loggingService.logUserAction("API_USER", "INTERVIEW_RESCHEDULED",
                    String.format("Rescheduled interview %d to %s", interviewId,
                            request.getNewScheduledTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Interview rescheduled successfully");
            response.put("interview", createInterviewResponse(interview));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            loggingService.error("Failed to reschedule interview via API", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to reschedule interview: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{interviewId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<Map<String, Object>> cancelInterview(@PathVariable Long interviewId,
            @RequestParam String reason) {
        try {
            interviewSchedulingService.cancelInterview(interviewId, reason);

            loggingService.logUserAction("API_USER", "INTERVIEW_CANCELLED",
                    String.format("Cancelled interview %d - Reason: %s", interviewId, reason));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Interview cancelled successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            loggingService.error("Failed to cancel interview via API", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to cancel interview: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{interviewId}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<Map<String, Object>> completeInterview(@PathVariable Long interviewId,
            @RequestBody CompleteInterviewRequest request) {
        try {
            interviewSchedulingService.completeInterview(interviewId, request.getScore(), request.getFeedback());

            loggingService.logUserAction("API_USER", "INTERVIEW_COMPLETED",
                    String.format("Completed interview %d with score %d", interviewId, request.getScore()));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Interview completed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            loggingService.error("Failed to complete interview via API", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to complete interview: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER') or hasRole('STUDENT')")
    public ResponseEntity<List<Map<String, Object>>> getInterviewsForApplication(@PathVariable Long applicationId) {
        try {
            List<Interview> interviews = interviewSchedulingService.getInterviewsForApplication(applicationId);

            List<Map<String, Object>> response = interviews.stream()
                    .map(this::createInterviewResponse)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            loggingService.error("Failed to get interviews for application via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/interviewer/{interviewerEmail}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<List<Map<String, Object>>> getInterviewsForInterviewer(@PathVariable String interviewerEmail) {
        try {
            List<Interview> interviews = interviewSchedulingService.getInterviewsForInterviewer(interviewerEmail);

            List<Map<String, Object>> response = interviews.stream()
                    .map(this::createInterviewResponse)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            loggingService.error("Failed to get interviews for interviewer via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/upcoming/{interviewerEmail}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingInterviews(@PathVariable String interviewerEmail) {
        try {
            List<Interview> interviews = interviewSchedulingService.getUpcomingInterviews(interviewerEmail);

            List<Map<String, Object>> response = interviews.stream()
                    .map(this::createInterviewResponse)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            loggingService.error("Failed to get upcoming interviews via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getInterviewStatistics() {
        try {
            Map<String, Object> stats = interviewSchedulingService.getInterviewStatistics();
            loggingService.logUserAction("API_ADMIN", "INTERVIEW_STATS_VIEW", "Viewed interview statistics");
            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            loggingService.error("Failed to get interview statistics via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/available-slots")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<List<Map<String, Object>>> getAvailableSlots(
            @RequestParam String interviewerEmail,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "60") int durationMinutes) {
        try {
            List<Interview> availableSlots = interviewSchedulingService.findAvailableSlots(
                    interviewerEmail, startDate, endDate, durationMinutes);

            List<Map<String, Object>> response = availableSlots.stream()
                    .map(this::createInterviewResponse)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            loggingService.error("Failed to get available slots via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/types")
    public ResponseEntity<Map<String, Object>> getInterviewTypes() {
        try {
            Map<String, Object> typesInfo = new HashMap<>();
            typesInfo.put("types", InterviewType.values());
            typesInfo.put("statuses", InterviewStatus.values());
            typesInfo.put("typeDescriptions", getTypeDescriptions());

            return ResponseEntity.ok(typesInfo);

        } catch (Exception e) {
            loggingService.error("Failed to get interview types via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    private Map<String, Object> createInterviewResponse(Interview interview) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", interview.getId());
        response.put("applicationId", interview.getApplicationId());
        response.put("type", interview.getType());
        response.put("typeName", getTypeDisplayName(interview.getType()));
        response.put("scheduledTime", interview.getScheduledTime());
        response.put("endTime", interview.getEndTime());
        response.put("interviewerEmail", interview.getInterviewerEmail());
        response.put("interviewerName", interview.getInterviewerName());
        response.put("location", interview.getLocation());
        response.put("meetingLink", interview.getMeetingLink());
        response.put("status", interview.getStatus());
        response.put("statusName", getStatusDisplayName(interview.getStatus()));
        response.put("notes", interview.getNotes());
        response.put("score", interview.getScore());
        response.put("feedback", interview.getFeedback());
        response.put("createdAt", interview.getCreatedAt());
        response.put("updatedAt", interview.getUpdatedAt());
        return response;
    }

    private String getTypeDisplayName(InterviewType type) {
        switch (type) {
            case PHONE_SCREENING:
                return "Phone Screening";
            case TECHNICAL_INTERVIEW:
                return "Technical Interview";
            case HR_INTERVIEW:
                return "HR Interview";
            case PANEL_INTERVIEW:
                return "Panel Interview";
            case FINAL_INTERVIEW:
                return "Final Interview";
            default:
                return type.toString();
        }
    }

    private String getStatusDisplayName(InterviewStatus status) {
        switch (status) {
            case SCHEDULED:
                return "Scheduled";
            case CONFIRMED:
                return "Confirmed";
            case IN_PROGRESS:
                return "In Progress";
            case COMPLETED:
                return "Completed";
            case CANCELLED:
                return "Cancelled";
            case RESCHEDULED:
                return "Rescheduled";
            case NO_SHOW:
                return "No Show";
            default:
                return status.toString();
        }
    }

    private Map<InterviewType, String> getTypeDescriptions() {
        Map<InterviewType, String> descriptions = new HashMap<>();
        descriptions.put(InterviewType.PHONE_SCREENING, "Initial phone screening with recruiter");
        descriptions.put(InterviewType.TECHNICAL_INTERVIEW, "Technical skills assessment");
        descriptions.put(InterviewType.HR_INTERVIEW, "HR interview for cultural fit");
        descriptions.put(InterviewType.PANEL_INTERVIEW, "Interview with multiple team members");
        descriptions.put(InterviewType.FINAL_INTERVIEW, "Final interview with senior management");
        return descriptions;
    }
}
