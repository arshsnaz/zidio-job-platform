package com.example.job_platform.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.Entity.Application;
import com.example.job_platform.Entity.User;
import com.example.job_platform.Exception.BusinessRuleException;
import com.example.job_platform.Exception.ResourceNotFoundException;
import com.example.job_platform.Repository.ApplicationRepository;
import com.example.job_platform.Repository.UserRepository;

@Service
public class InterviewSchedulingService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoggingService loggingService;

    @Autowired
    private NotificationService notificationService;

    // Track scheduled interviews
    private final Map<Long, List<Interview>> applicationInterviews = new ConcurrentHashMap<>();
    private final Map<String, List<Interview>> interviewerSchedules = new ConcurrentHashMap<>();
    private Long interviewIdCounter = 1L;

    public enum InterviewType {
        PHONE_SCREENING,
        TECHNICAL_INTERVIEW,
        HR_INTERVIEW,
        PANEL_INTERVIEW,
        FINAL_INTERVIEW
    }

    public enum InterviewStatus {
        SCHEDULED,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        RESCHEDULED,
        NO_SHOW
    }

    public static class Interview {

        private final Long id;
        private final Long applicationId;
        private final InterviewType type;
        private LocalDateTime scheduledTime;
        private LocalDateTime endTime;
        private String interviewerEmail;
        private String interviewerName;
        private String meetingLink;
        private String location;
        private InterviewStatus status;
        private String notes;
        private Integer score;
        private String feedback;
        private final LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Interview(Long id, Long applicationId, InterviewType type, LocalDateTime scheduledTime,
                LocalDateTime endTime, String interviewerEmail, String interviewerName) {
            this.id = id;
            this.applicationId = applicationId;
            this.type = type;
            this.scheduledTime = scheduledTime;
            this.endTime = endTime;
            this.interviewerEmail = interviewerEmail;
            this.interviewerName = interviewerName;
            this.status = InterviewStatus.SCHEDULED;
            this.createdAt = LocalDateTime.now();
            this.updatedAt = LocalDateTime.now();
        }

        // Getters and setters
        public Long getId() {
            return id;
        }

        public Long getApplicationId() {
            return applicationId;
        }

        public InterviewType getType() {
            return type;
        }

        public LocalDateTime getScheduledTime() {
            return scheduledTime;
        }

        public void setScheduledTime(LocalDateTime scheduledTime) {
            this.scheduledTime = scheduledTime;
            this.updatedAt = LocalDateTime.now();
        }

        public LocalDateTime getEndTime() {
            return endTime;
        }

        public void setEndTime(LocalDateTime endTime) {
            this.endTime = endTime;
            this.updatedAt = LocalDateTime.now();
        }

        public String getInterviewerEmail() {
            return interviewerEmail;
        }

        public void setInterviewerEmail(String interviewerEmail) {
            this.interviewerEmail = interviewerEmail;
            this.updatedAt = LocalDateTime.now();
        }

        public String getInterviewerName() {
            return interviewerName;
        }

        public void setInterviewerName(String interviewerName) {
            this.interviewerName = interviewerName;
            this.updatedAt = LocalDateTime.now();
        }

        public String getMeetingLink() {
            return meetingLink;
        }

        public void setMeetingLink(String meetingLink) {
            this.meetingLink = meetingLink;
            this.updatedAt = LocalDateTime.now();
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
            this.updatedAt = LocalDateTime.now();
        }

        public InterviewStatus getStatus() {
            return status;
        }

        public void setStatus(InterviewStatus status) {
            this.status = status;
            this.updatedAt = LocalDateTime.now();
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
            this.updatedAt = LocalDateTime.now();
        }

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
            this.updatedAt = LocalDateTime.now();
        }

        public String getFeedback() {
            return feedback;
        }

        public void setFeedback(String feedback) {
            this.feedback = feedback;
            this.updatedAt = LocalDateTime.now();
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }
    }

    public Interview scheduleInterview(Long applicationId, InterviewType type, LocalDateTime scheduledTime,
            LocalDateTime endTime, String interviewerEmail, String interviewerName,
            String location, String meetingLink) {
        try {
            // Validate application exists
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

            // Validate interviewer exists and log their participation
            User interviewer = userRepository.findByEmail(interviewerEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User", interviewerEmail));

            loggingService.info("Interviewer validated: " + interviewer.getName() + " (" + interviewerEmail + ")");

            // Check for scheduling conflicts
            if (hasSchedulingConflict(interviewerEmail, scheduledTime, endTime)) {
                throw new BusinessRuleException("Interviewer has a scheduling conflict at the requested time");
            }

            // Create new interview
            Long interviewId = generateInterviewId();
            Interview interview = new Interview(interviewId, applicationId, type, scheduledTime,
                    endTime, interviewerEmail, interviewerName);
            interview.setLocation(location);
            interview.setMeetingLink(meetingLink);

            // Store interview
            applicationInterviews.computeIfAbsent(applicationId, k -> new ArrayList<>()).add(interview);
            interviewerSchedules.computeIfAbsent(interviewerEmail, k -> new ArrayList<>()).add(interview);

            // Log the scheduling
            loggingService.logUserAction("SYSTEM", "INTERVIEW_SCHEDULED",
                    String.format("Interview scheduled - Application: %d, Type: %s, Time: %s",
                            applicationId, type, scheduledTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));

            // Send notifications
            sendInterviewNotifications(interview, application);

            return interview;

        } catch (Exception e) {
            loggingService.error("Failed to schedule interview", e);
            throw new BusinessRuleException("Failed to schedule interview: " + e.getMessage());
        }
    }

    public Interview rescheduleInterview(Long interviewId, LocalDateTime newScheduledTime,
            LocalDateTime newEndTime, String reason) {
        try {
            Interview interview = findInterviewById(interviewId);
            if (interview == null) {
                throw new ResourceNotFoundException("Interview", interviewId);
            }

            // Check for conflicts with new time
            if (hasSchedulingConflict(interview.getInterviewerEmail(), newScheduledTime, newEndTime, interviewId)) {
                throw new BusinessRuleException("Interviewer has a scheduling conflict at the new requested time");
            }

            // Update interview details
            LocalDateTime oldTime = interview.getScheduledTime();
            interview.setScheduledTime(newScheduledTime);
            interview.setEndTime(newEndTime);
            interview.setStatus(InterviewStatus.RESCHEDULED);
            interview.setNotes(interview.getNotes() + "\nRescheduled from "
                    + oldTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) + " - Reason: " + reason);

            // Log the rescheduling
            loggingService.logUserAction("SYSTEM", "INTERVIEW_RESCHEDULED",
                    String.format("Interview %d rescheduled from %s to %s - Reason: %s",
                            interviewId, oldTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                            newScheduledTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME), reason));

            // Send rescheduling notifications
            Application application = applicationRepository.findById(interview.getApplicationId()).orElse(null);
            if (application != null) {
                sendRescheduleNotifications(interview, application, reason);
            }

            return interview;

        } catch (Exception e) {
            loggingService.error("Failed to reschedule interview", e);
            throw new BusinessRuleException("Failed to reschedule interview: " + e.getMessage());
        }
    }

    public void cancelInterview(Long interviewId, String reason) {
        try {
            Interview interview = findInterviewById(interviewId);
            if (interview == null) {
                throw new ResourceNotFoundException("Interview", interviewId);
            }

            interview.setStatus(InterviewStatus.CANCELLED);
            interview.setNotes(interview.getNotes() + "\nCancelled - Reason: " + reason);

            // Log the cancellation
            loggingService.logUserAction("SYSTEM", "INTERVIEW_CANCELLED",
                    String.format("Interview %d cancelled - Reason: %s", interviewId, reason));

            // Send cancellation notifications
            Application application = applicationRepository.findById(interview.getApplicationId()).orElse(null);
            if (application != null) {
                sendCancellationNotifications(interview, application, reason);
            }

        } catch (Exception e) {
            loggingService.error("Failed to cancel interview", e);
            throw new BusinessRuleException("Failed to cancel interview: " + e.getMessage());
        }
    }

    public void completeInterview(Long interviewId, Integer score, String feedback) {
        try {
            Interview interview = findInterviewById(interviewId);
            if (interview == null) {
                throw new ResourceNotFoundException("Interview", interviewId);
            }

            interview.setStatus(InterviewStatus.COMPLETED);
            interview.setScore(score);
            interview.setFeedback(feedback);

            // Log the completion
            loggingService.logUserAction("SYSTEM", "INTERVIEW_COMPLETED",
                    String.format("Interview %d completed - Score: %d", interviewId, score));

            // Update application workflow if this was the final interview
            updateApplicationWorkflowAfterInterview(interview);

        } catch (Exception e) {
            loggingService.error("Failed to complete interview", e);
            throw new BusinessRuleException("Failed to complete interview: " + e.getMessage());
        }
    }

    public List<Interview> getInterviewsForApplication(Long applicationId) {
        return applicationInterviews.getOrDefault(applicationId, new ArrayList<>());
    }

    public List<Interview> getInterviewsForInterviewer(String interviewerEmail) {
        return interviewerSchedules.getOrDefault(interviewerEmail, new ArrayList<>());
    }

    public List<Interview> getUpcomingInterviews(String interviewerEmail) {
        List<Interview> interviews = getInterviewsForInterviewer(interviewerEmail);
        LocalDateTime now = LocalDateTime.now();

        return interviews.stream()
                .filter(interview -> interview.getScheduledTime().isAfter(now))
                .filter(interview -> interview.getStatus() == InterviewStatus.SCHEDULED
                || interview.getStatus() == InterviewStatus.CONFIRMED)
                .sorted((i1, i2) -> i1.getScheduledTime().compareTo(i2.getScheduledTime()))
                .collect(java.util.stream.Collectors.toList());
    }

    public Map<String, Object> getInterviewStatistics() {
        Map<String, Object> stats = new HashMap<>();

        int totalInterviews = 0;
        Map<InterviewStatus, Integer> statusCounts = new HashMap<>();
        Map<InterviewType, Integer> typeCounts = new HashMap<>();

        for (List<Interview> interviews : applicationInterviews.values()) {
            for (Interview interview : interviews) {
                totalInterviews++;
                statusCounts.merge(interview.getStatus(), 1, Integer::sum);
                typeCounts.merge(interview.getType(), 1, Integer::sum);
            }
        }

        stats.put("totalInterviews", totalInterviews);
        stats.put("statusBreakdown", statusCounts);
        stats.put("typeBreakdown", typeCounts);
        stats.put("activeInterviewers", interviewerSchedules.size());

        return stats;
    }

    public List<Interview> findAvailableSlots(String interviewerEmail, LocalDateTime startDate,
            LocalDateTime endDate, int durationMinutes) {
        List<Interview> existingInterviews = getInterviewsForInterviewer(interviewerEmail);
        List<Interview> availableSlots = new ArrayList<>();

        // Simple slot finding - can be enhanced with more sophisticated logic
        LocalDateTime slot = startDate;
        while (slot.isBefore(endDate)) {
            final LocalDateTime currentSlot = slot;
            LocalDateTime slotEnd = currentSlot.plusMinutes(durationMinutes);

            boolean isAvailable = existingInterviews.stream()
                    .noneMatch(interview
                            -> interview.getStatus() != InterviewStatus.CANCELLED
                    && !(slotEnd.isBefore(interview.getScheduledTime())
                    || currentSlot.isAfter(interview.getEndTime()))
                    );

            if (isAvailable) {
                Interview availableSlot = new Interview(0L, 0L, InterviewType.TECHNICAL_INTERVIEW,
                        currentSlot, slotEnd, interviewerEmail, "");
                availableSlots.add(availableSlot);
            }

            slot = slot.plusMinutes(30); // Check every 30 minutes
        }

        return availableSlots;
    }

    private synchronized Long generateInterviewId() {
        return interviewIdCounter++;
    }

    private Interview findInterviewById(Long interviewId) {
        for (List<Interview> interviews : applicationInterviews.values()) {
            for (Interview interview : interviews) {
                if (interview.getId().equals(interviewId)) {
                    return interview;
                }
            }
        }
        return null;
    }

    private boolean hasSchedulingConflict(String interviewerEmail, LocalDateTime startTime,
            LocalDateTime endTime) {
        return hasSchedulingConflict(interviewerEmail, startTime, endTime, null);
    }

    private boolean hasSchedulingConflict(String interviewerEmail, LocalDateTime startTime,
            LocalDateTime endTime, Long excludeInterviewId) {
        List<Interview> existingInterviews = getInterviewsForInterviewer(interviewerEmail);

        return existingInterviews.stream()
                .filter(interview -> excludeInterviewId == null || !interview.getId().equals(excludeInterviewId))
                .filter(interview -> interview.getStatus() != InterviewStatus.CANCELLED)
                .anyMatch(interview
                        -> !(endTime.isBefore(interview.getScheduledTime())
                || startTime.isAfter(interview.getEndTime()))
                );
    }

    private void sendInterviewNotifications(Interview interview, Application application) {
        try {
            if (application.getStudent() != null && application.getStudent().getUser() != null) {
                String message = String.format(
                        "You have been scheduled for a %s interview on %s with %s. Location: %s",
                        interview.getType().toString().replace("_", " "),
                        interview.getScheduledTime().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm")),
                        interview.getInterviewerName(),
                        interview.getLocation() != null ? interview.getLocation() : "Virtual"
                );

                // Use application status update notification as a workaround
                notificationService.notifyApplicationStatusUpdate(interview.getApplicationId(),
                        "Interview Scheduled: " + message);
            }
        } catch (Exception e) {
            loggingService.error("Failed to send interview notifications", e);
        }
    }

    private void sendRescheduleNotifications(Interview interview, Application application, String reason) {
        try {
            if (application.getStudent() != null && application.getStudent().getUser() != null) {
                String message = String.format(
                        "Your %s interview has been rescheduled to %s. Reason: %s",
                        interview.getType().toString().replace("_", " "),
                        interview.getScheduledTime().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm")),
                        reason
                );

                notificationService.notifyApplicationStatusUpdate(interview.getApplicationId(),
                        "Interview Rescheduled: " + message);
            }
        } catch (Exception e) {
            loggingService.error("Failed to send reschedule notifications", e);
        }
    }

    private void sendCancellationNotifications(Interview interview, Application application, String reason) {
        try {
            if (application.getStudent() != null && application.getStudent().getUser() != null) {
                String message = String.format(
                        "Your %s interview scheduled for %s has been cancelled. Reason: %s",
                        interview.getType().toString().replace("_", " "),
                        interview.getScheduledTime().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm")),
                        reason
                );

                notificationService.notifyApplicationStatusUpdate(interview.getApplicationId(),
                        "Interview Cancelled: " + message);
            }
        } catch (Exception e) {
            loggingService.error("Failed to send cancellation notifications", e);
        }
    }

    private void updateApplicationWorkflowAfterInterview(Interview interview) {
        try {
            // This would integrate with WorkflowService to update application status
            // based on interview completion and score
            if (interview.getScore() != null && interview.getScore() >= 70) {
                // High score - move to next stage
                loggingService.info("Interview completed with high score, application ready for next stage");
            } else if (interview.getScore() != null && interview.getScore() < 50) {
                // Low score - consider rejection
                loggingService.info("Interview completed with low score, application may be rejected");
            }
        } catch (Exception e) {
            loggingService.error("Failed to update application workflow after interview", e);
        }
    }
}
