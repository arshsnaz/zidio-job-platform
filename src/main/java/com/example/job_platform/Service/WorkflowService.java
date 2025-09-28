package com.example.job_platform.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.Entity.Application;
import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Entity.Student;
import com.example.job_platform.Enum.Status;
import com.example.job_platform.Exception.BusinessRuleException;
import com.example.job_platform.Exception.ResourceNotFoundException;
import com.example.job_platform.Repository.ApplicationRepository;

@Service
public class WorkflowService {

    @Autowired
    private ApplicationRepository applicationRepository;

    // Repositories are autowired for potential future use in advanced workflow features
    @Autowired
    private LoggingService loggingService;

    @Autowired
    private NotificationService notificationService;

    // Track workflow states and transitions
    private final Map<Long, WorkflowState> applicationWorkflows = new ConcurrentHashMap<>();

    public enum WorkflowState {
        INITIAL_REVIEW,
        TECHNICAL_SCREENING,
        HR_INTERVIEW,
        TECHNICAL_INTERVIEW,
        FINAL_REVIEW,
        APPROVED,
        REJECTED,
        ON_HOLD
    }

    public enum WorkflowAction {
        APPROVE,
        REJECT,
        MOVE_TO_NEXT_STAGE,
        PUT_ON_HOLD,
        REQUEST_ADDITIONAL_INFO
    }

    public static class WorkflowTransition {

        private final Long applicationId;
        private final WorkflowState fromState;
        private final WorkflowState toState;
        private final WorkflowAction action;
        private final String performedBy;
        private final String comments;
        private final LocalDateTime timestamp;

        public WorkflowTransition(Long applicationId, WorkflowState fromState, WorkflowState toState,
                WorkflowAction action, String performedBy, String comments) {
            this.applicationId = applicationId;
            this.fromState = fromState;
            this.toState = toState;
            this.action = action;
            this.performedBy = performedBy;
            this.comments = comments;
            this.timestamp = LocalDateTime.now();
        }

        // Getters
        public Long getApplicationId() {
            return applicationId;
        }

        public WorkflowState getFromState() {
            return fromState;
        }

        public WorkflowState getToState() {
            return toState;
        }

        public WorkflowAction getAction() {
            return action;
        }

        public String getPerformedBy() {
            return performedBy;
        }

        public String getComments() {
            return comments;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }
    }

    private final List<WorkflowTransition> workflowHistory = new ArrayList<>();

    public void initiateApplicationWorkflow(Long applicationId) {
        try {
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

            applicationWorkflows.put(applicationId, WorkflowState.INITIAL_REVIEW);

            // Use application context for enhanced logging
            loggingService.logUserAction("SYSTEM", "WORKFLOW_INITIATED",
                    "Application workflow initiated for application ID: " + applicationId
                    + " (Job: " + application.getJob().getId() + ", Student: " + application.getStudent().getId() + ")");

            // Auto-perform initial checks
            performInitialReview(applicationId);

        } catch (Exception e) {
            loggingService.error("Failed to initiate workflow for application: " + applicationId, e);
            throw new BusinessRuleException("Failed to initiate application workflow");
        }
    }

    private void performInitialReview(Long applicationId) {
        try {
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

            Student student = application.getStudent();
            if (student == null) {
                moveToState(applicationId, WorkflowState.REJECTED, WorkflowAction.REJECT,
                        "SYSTEM", "No student profile found");
                return;
            }

            // Basic qualification checks
            boolean hasRequiredSkills = checkStudentQualifications(student, application.getJob());
            boolean hasCompleteProfile = checkProfileCompleteness(student);

            if (hasRequiredSkills && hasCompleteProfile) {
                moveToState(applicationId, WorkflowState.TECHNICAL_SCREENING, WorkflowAction.MOVE_TO_NEXT_STAGE,
                        "SYSTEM", "Passed initial review");
            } else {
                moveToState(applicationId, WorkflowState.ON_HOLD, WorkflowAction.PUT_ON_HOLD,
                        "SYSTEM", "Incomplete profile or missing qualifications");
            }

        } catch (Exception e) {
            loggingService.error("Failed to perform initial review for application: " + applicationId, e);
        }
    }

    public void moveToState(Long applicationId, WorkflowState newState, WorkflowAction action,
            String performedBy, String comments) {
        try {
            WorkflowState currentState = applicationWorkflows.get(applicationId);

            if (currentState == null) {
                throw new BusinessRuleException("No workflow found for application: " + applicationId);
            }

            // Validate state transition
            if (!isValidTransition(currentState, newState)) {
                throw new BusinessRuleException(
                        String.format("Invalid workflow transition from %s to %s", currentState, newState));
            }

            // Update workflow state
            applicationWorkflows.put(applicationId, newState);

            // Record transition
            WorkflowTransition transition = new WorkflowTransition(
                    applicationId, currentState, newState, action, performedBy, comments);
            workflowHistory.add(transition);

            // Update application status in database
            updateApplicationStatus(applicationId, newState);

            // Log the transition
            loggingService.logUserAction(performedBy, "WORKFLOW_TRANSITION",
                    String.format("Application %d moved from %s to %s", applicationId, currentState, newState));

            // Send notifications
            sendWorkflowNotifications(applicationId, newState, performedBy);

        } catch (Exception e) {
            loggingService.error("Failed to move application to new state", e);
            throw new BusinessRuleException("Failed to update application workflow");
        }
    }

    private boolean isValidTransition(WorkflowState fromState, WorkflowState toState) {
        // Define valid state transitions
        Map<WorkflowState, List<WorkflowState>> validTransitions = new HashMap<>();

        validTransitions.put(WorkflowState.INITIAL_REVIEW,
                Arrays.asList(WorkflowState.TECHNICAL_SCREENING, WorkflowState.REJECTED, WorkflowState.ON_HOLD));

        validTransitions.put(WorkflowState.TECHNICAL_SCREENING,
                Arrays.asList(WorkflowState.HR_INTERVIEW, WorkflowState.REJECTED, WorkflowState.ON_HOLD));

        validTransitions.put(WorkflowState.HR_INTERVIEW,
                Arrays.asList(WorkflowState.TECHNICAL_INTERVIEW, WorkflowState.REJECTED, WorkflowState.ON_HOLD));

        validTransitions.put(WorkflowState.TECHNICAL_INTERVIEW,
                Arrays.asList(WorkflowState.FINAL_REVIEW, WorkflowState.REJECTED, WorkflowState.ON_HOLD));

        validTransitions.put(WorkflowState.FINAL_REVIEW,
                Arrays.asList(WorkflowState.APPROVED, WorkflowState.REJECTED));

        validTransitions.put(WorkflowState.ON_HOLD,
                Arrays.asList(WorkflowState.TECHNICAL_SCREENING, WorkflowState.HR_INTERVIEW,
                        WorkflowState.TECHNICAL_INTERVIEW, WorkflowState.FINAL_REVIEW, WorkflowState.REJECTED));

        return validTransitions.getOrDefault(fromState, new ArrayList<>()).contains(toState);
    }

    private void updateApplicationStatus(Long applicationId, WorkflowState workflowState) {
        try {
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

            // Map workflow states to application statuses
            Status newStatus;
            switch (workflowState) {
                case APPROVED:
                    newStatus = Status.SELECTED;
                    break;
                case REJECTED:
                    newStatus = Status.REJECTED;
                    break;
                case ON_HOLD:
                    newStatus = Status.APPLIED;
                    break;
                default:
                    newStatus = Status.SHORTLIST;
                    break;
            }

            application.setStatus(newStatus);
            applicationRepository.save(application);

        } catch (Exception e) {
            loggingService.error("Failed to update application status in database", e);
        }
    }

    private void sendWorkflowNotifications(Long applicationId, WorkflowState newState, String performedBy) {
        try {
            Application application = applicationRepository.findById(applicationId).orElse(null);
            if (application == null || application.getStudent() == null) {
                return;
            }

            String statusMessage = getStatusMessage(newState);
            notificationService.notifyApplicationStatusUpdate(applicationId, statusMessage);

        } catch (Exception e) {
            loggingService.error("Failed to send workflow notifications", e);
        }
    }

    private String getStatusMessage(WorkflowState state) {
        switch (state) {
            case TECHNICAL_SCREENING:
                return "Your application is being reviewed by our technical team";
            case HR_INTERVIEW:
                return "Congratulations! You've been selected for an HR interview";
            case TECHNICAL_INTERVIEW:
                return "You've advanced to the technical interview stage";
            case FINAL_REVIEW:
                return "Your application is in final review";
            case APPROVED:
                return "Congratulations! Your application has been approved";
            case REJECTED:
                return "Thank you for your interest. Unfortunately, we cannot proceed with your application at this time";
            case ON_HOLD:
                return "Your application is currently on hold pending additional information";
            default:
                return "Your application status has been updated";
        }
    }

    private boolean checkStudentQualifications(Student student, JobPost job) {
        try {
            if (student.getSkills() == null || job.getDescription() == null) {
                return false;
            }

            // Simple skill matching - can be enhanced with more sophisticated logic
            String studentSkills = student.getSkills().toLowerCase();
            String jobDescription = job.getDescription().toLowerCase();

            // Check for common technical skills
            String[] commonSkills = {"java", "python", "javascript", "react", "spring", "sql", "html", "css"};

            for (String skill : commonSkills) {
                if (jobDescription.contains(skill) && studentSkills.contains(skill)) {
                    return true; // Found at least one matching skill
                }
            }

            return false;
        } catch (Exception e) {
            loggingService.error("Error checking student qualifications", e);
            return false;
        }
    }

    private boolean checkProfileCompleteness(Student student) {
        try {
            return student.getSkills() != null && !student.getSkills().trim().isEmpty()
                    && student.getEducation() != null && !student.getEducation().trim().isEmpty()
                    && student.getUser() != null && student.getUser().getEmail() != null;
        } catch (Exception e) {
            loggingService.error("Error checking profile completeness", e);
            return false;
        }
    }

    public WorkflowState getCurrentState(Long applicationId) {
        return applicationWorkflows.get(applicationId);
    }

    public List<WorkflowTransition> getWorkflowHistory(Long applicationId) {
        return workflowHistory.stream()
                .filter(transition -> transition.getApplicationId().equals(applicationId))
                .collect(java.util.stream.Collectors.toList());
    }

    public Map<WorkflowState, Long> getWorkflowStatistics() {
        Map<WorkflowState, Long> stats = new HashMap<>();

        for (WorkflowState state : WorkflowState.values()) {
            long count = applicationWorkflows.values().stream()
                    .filter(s -> s == state)
                    .count();
            stats.put(state, count);
        }

        return stats;
    }

    public void bulkProcessApplications(List<Long> applicationIds, WorkflowAction action,
            String performedBy, String comments) {
        for (Long applicationId : applicationIds) {
            try {
                WorkflowState currentState = getCurrentState(applicationId);
                if (currentState != null) {
                    WorkflowState nextState = determineNextState(currentState, action);
                    if (nextState != null) {
                        moveToState(applicationId, nextState, action, performedBy, comments);
                    }
                }
            } catch (Exception e) {
                loggingService.error("Failed to process application in bulk: " + applicationId, e);
            }
        }
    }

    private WorkflowState determineNextState(WorkflowState currentState, WorkflowAction action) {
        switch (action) {
            case APPROVE:
                return currentState == WorkflowState.FINAL_REVIEW ? WorkflowState.APPROVED : null;
            case REJECT:
                return WorkflowState.REJECTED;
            case PUT_ON_HOLD:
                return WorkflowState.ON_HOLD;
            case MOVE_TO_NEXT_STAGE:
                return getNextStage(currentState);
            default:
                return null;
        }
    }

    private WorkflowState getNextStage(WorkflowState currentState) {
        switch (currentState) {
            case INITIAL_REVIEW:
                return WorkflowState.TECHNICAL_SCREENING;
            case TECHNICAL_SCREENING:
                return WorkflowState.HR_INTERVIEW;
            case HR_INTERVIEW:
                return WorkflowState.TECHNICAL_INTERVIEW;
            case TECHNICAL_INTERVIEW:
                return WorkflowState.FINAL_REVIEW;
            case ON_HOLD:
                return WorkflowState.TECHNICAL_SCREENING; // Resume from technical screening
            default:
                return null;
        }
    }
}
